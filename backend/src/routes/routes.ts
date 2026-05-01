import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database';
import { authenticateToken, requireUserType } from '../middleware/auth';
import { AuthRequest, Route, RouteStop } from '../types';

const router = express.Router();

// Get all routes
router.get('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { page = 1, limit = 10, status, collector_id } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = `
      SELECT r.*, u.full_name as collector_name 
      FROM routes r 
      LEFT JOIN users u ON r.collector_id = u.id 
      WHERE 1=1
    `;
    let countQuery = 'SELECT COUNT(*) FROM routes WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND r.status = $${paramIndex}`;
      countQuery += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (collector_id) {
      query += ` AND r.collector_id = $${paramIndex}`;
      countQuery += ` AND collector_id = $${paramIndex}`;
      params.push(collector_id);
      paramIndex++;
    }

    query += ` ORDER BY r.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(Number(limit), offset);

    const routesQuery = await pool.query(query, params);
    const countResult = await pool.query(countQuery, params.slice(0, -2));

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      message: 'Routes retrieved successfully',
      data: routesQuery.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get route with stops
router.get('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { id } = req.params;

    const routeQuery = await pool.query(`
      SELECT r.*, u.full_name as collector_name 
      FROM routes r 
      LEFT JOIN users u ON r.collector_id = u.id 
      WHERE r.id = $1
    `, [id]);

    if (routeQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    const stopsQuery = await pool.query(
      'SELECT * FROM route_stops WHERE route_id = $1 ORDER BY sequence_number ASC',
      [id]
    );

    const routeWithStops = {
      ...routeQuery.rows[0],
      stops: stopsQuery.rows
    };

    res.json({
      success: true,
      message: 'Route retrieved successfully',
      data: routeWithStops
    });
  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new route
router.post('/', authenticateToken, [
  body('name').isLength({ min: 1, max: 100 }).withMessage('Route name must be 1-100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description too long'),
  body('collector_id').optional().isUUID().withMessage('Invalid collector ID')
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

    const { name, description, collector_id } = req.body;

    const newRouteQuery = await pool.query(
      'INSERT INTO routes (name, description, collector_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description, collector_id]
    );

    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: newRouteQuery.rows[0]
    });
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add stop to route
router.post('/:id/stops', authenticateToken, [
  body('name').isLength({ min: 1, max: 100 }).withMessage('Stop name must be 1-100 characters'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('address').optional().isLength({ max: 500 }).withMessage('Address too long'),
  body('sequence_number').isInt({ min: 1 }).withMessage('Sequence number must be positive integer')
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
    const { name, latitude, longitude, address, sequence_number } = req.body;

    // Check if route exists
    const routeQuery = await pool.query('SELECT id FROM routes WHERE id = $1', [id]);
    if (routeQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    const newStopQuery = await pool.query(
      'INSERT INTO route_stops (route_id, name, latitude, longitude, address, sequence_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, name, latitude, longitude, address, sequence_number]
    );

    res.status(201).json({
      success: true,
      message: 'Stop added successfully',
      data: newStopQuery.rows[0]
    });
  } catch (error) {
    console.error('Add stop error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update stop status
router.put('/:routeId/stops/:stopId', authenticateToken, [
  body('status').isIn(['pending', 'completed', 'skipped']).withMessage('Invalid status')
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

    const { routeId, stopId } = req.params;
    const { status } = req.body;

    const updateQuery = await pool.query(
      'UPDATE route_stops SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND route_id = $3 RETURNING *',
      [status, stopId, routeId]
    );

    if (updateQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Stop not found'
      });
    }

    res.json({
      success: true,
      message: 'Stop status updated successfully',
      data: updateQuery.rows[0]
    });
  } catch (error) {
    console.error('Update stop error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete route
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { id } = req.params;

    const deleteQuery = await pool.query('DELETE FROM routes WHERE id = $1 RETURNING *', [id]);

    if (deleteQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete stop
router.delete('/:routeId/stops/:stopId', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { routeId, stopId } = req.params;

    const deleteQuery = await pool.query(
      'DELETE FROM route_stops WHERE id = $1 AND route_id = $2 RETURNING *',
      [stopId, routeId]
    );

    if (deleteQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Stop not found'
      });
    }

    res.json({
      success: true,
      message: 'Stop deleted successfully'
    });
  } catch (error) {
    console.error('Delete stop error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
