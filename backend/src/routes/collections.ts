import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database';
import { authenticateToken, requireUserType } from '../middleware/auth';
import { AuthRequest, Collection } from '../types';

const router = express.Router();

// Get all collections
router.get('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { page = 1, limit = 10, collector_id, status, start_date, end_date } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = `
      SELECT c.*, 
             rs.name as stop_name, rs.latitude, rs.longitude,
             collector.full_name as collector_name,
             resident.full_name as resident_name,
             s.title as schedule_title
      FROM collections c
      LEFT JOIN route_stops rs ON c.route_stop_id = rs.id
      LEFT JOIN users collector ON c.collector_id = collector.id
      LEFT JOIN users resident ON c.resident_id = resident.id
      LEFT JOIN schedules s ON c.schedule_id = s.id
      WHERE 1=1
    `;
    let countQuery = 'SELECT COUNT(*) FROM collections WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (collector_id) {
      query += ` AND c.collector_id = $${paramIndex}`;
      countQuery += ` AND collector_id = $${paramIndex}`;
      params.push(collector_id);
      paramIndex++;
    }

    if (status) {
      query += ` AND c.status = $${paramIndex}`;
      countQuery += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (start_date) {
      query += ` AND c.collection_time >= $${paramIndex}`;
      countQuery += ` AND collection_time >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }

    if (end_date) {
      query += ` AND c.collection_time <= $${paramIndex}`;
      countQuery += ` AND collection_time <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }

    query += ` ORDER BY c.collection_time DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(Number(limit), offset);

    const collectionsQuery = await pool.query(query, params);
    const countResult = await pool.query(countQuery, params.slice(0, -2));

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      message: 'Collections retrieved successfully',
      data: collectionsQuery.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get collections error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get collection by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { id } = req.params;

    const collectionQuery = await pool.query(`
      SELECT c.*, 
             rs.name as stop_name, rs.latitude, rs.longitude,
             collector.full_name as collector_name,
             resident.full_name as resident_name,
             s.title as schedule_title
      FROM collections c
      LEFT JOIN route_stops rs ON c.route_stop_id = rs.id
      LEFT JOIN users collector ON c.collector_id = collector.id
      LEFT JOIN users resident ON c.resident_id = resident.id
      LEFT JOIN schedules s ON c.schedule_id = s.id
      WHERE c.id = $1
    `, [id]);

    if (collectionQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    res.json({
      success: true,
      message: 'Collection retrieved successfully',
      data: collectionQuery.rows[0]
    });
  } catch (error) {
    console.error('Get collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new collection (collector only)
router.post('/', authenticateToken, requireUserType('collector'), [
  body('route_stop_id').isUUID().withMessage('Invalid route stop ID'),
  body('waste_type').isIn(['biodegradable', 'non-biodegradable', 'recyclable']).withMessage('Invalid waste type'),
  body('weight_kg').optional().isFloat({ min: 0 }).withMessage('Weight must be positive'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes too long')
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.array()[0].msg
      });
    }

    const { route_stop_id, waste_type, weight_kg, notes } = req.body;
    const collector_id = req.user!.id;

    // Check if route stop exists
    const stopQuery = await pool.query('SELECT * FROM route_stops WHERE id = $1', [route_stop_id]);
    if (stopQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Route stop not found'
      });
    }

    const newCollectionQuery = await pool.query(
      'INSERT INTO collections (route_stop_id, collector_id, waste_type, weight_kg, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [route_stop_id, collector_id, waste_type, weight_kg, notes]
    );

    // Update route stop status to completed
    await pool.query(
      'UPDATE route_stops SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['completed', route_stop_id]
    );

    res.status(201).json({
      success: true,
      message: 'Collection recorded successfully',
      data: newCollectionQuery.rows[0]
    });
  } catch (error) {
    console.error('Create collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update collection
router.put('/:id', authenticateToken, [
  body('waste_type').optional().isIn(['biodegradable', 'non-biodegradable', 'recyclable']).withMessage('Invalid waste type'),
  body('weight_kg').optional().isFloat({ min: 0 }).withMessage('Weight must be positive'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes too long'),
  body('status').optional().isIn(['completed', 'missed', 'skipped']).withMessage('Invalid status')
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.array()[0].msg
      });
    }

    const { id } = req.params;
    const { waste_type, weight_kg, notes, status } = req.body;

    const updateFields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (waste_type !== undefined) {
      updateFields.push(`waste_type = $${paramIndex++}`);
      params.push(waste_type);
    }
    if (weight_kg !== undefined) {
      updateFields.push(`weight_kg = $${paramIndex++}`);
      params.push(weight_kg);
    }
    if (notes !== undefined) {
      updateFields.push(`notes = $${paramIndex++}`);
      params.push(notes);
    }
    if (status !== undefined) {
      updateFields.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    params.push(id);

    const updateQuery = `
      UPDATE collections 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    res.json({
      success: true,
      message: 'Collection updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get collection statistics
router.get('/stats/summary', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { start_date, end_date } = req.query;

    let dateFilter = '';
    const params: any[] = [];
    let paramIndex = 1;

    if (start_date || end_date) {
      dateFilter = 'WHERE ';
      const conditions: string[] = [];

      if (start_date) {
        conditions.push(`collection_time >= $${paramIndex++}`);
        params.push(start_date);
      }

      if (end_date) {
        conditions.push(`collection_time <= $${paramIndex++}`);
        params.push(end_date);
      }

      dateFilter += conditions.join(' AND ');
    }

    const statsQuery = await pool.query(`
      SELECT 
        COUNT(*) as total_collections,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_collections,
        COUNT(CASE WHEN status = 'missed' THEN 1 END) as missed_collections,
        COUNT(CASE WHEN status = 'skipped' THEN 1 END) as skipped_collections,
        COALESCE(SUM(weight_kg), 0) as total_weight,
        COUNT(CASE WHEN waste_type = 'biodegradable' THEN 1 END) as biodegradable_count,
        COUNT(CASE WHEN waste_type = 'non-biodegradable' THEN 1 END) as non_biodegradable_count,
        COUNT(CASE WHEN waste_type = 'recyclable' THEN 1 END) as recyclable_count
      FROM collections 
      ${dateFilter}
    `, params);

    const wasteTypeStats = await pool.query(`
      SELECT 
        waste_type,
        COUNT(*) as count,
        COALESCE(SUM(weight_kg), 0) as total_weight
      FROM collections 
      ${dateFilter}
      GROUP BY waste_type
    `, params);

    res.json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: {
        summary: statsQuery.rows[0],
        by_waste_type: wasteTypeStats.rows
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
