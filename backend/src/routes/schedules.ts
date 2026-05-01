import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database';
import { authenticateToken, requireUserType } from '../middleware/auth';
import { AuthRequest, Schedule } from '../types';

const router = express.Router();

// Get all schedules
router.get('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { page = 1, limit = 10, waste_type, status, start_date, end_date } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM schedules WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) FROM schedules WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (waste_type) {
      query += ` AND waste_type = $${paramIndex}`;
      countQuery += ` AND waste_type = $${paramIndex}`;
      params.push(waste_type);
      paramIndex++;
    }

    if (status) {
      query += ` AND status = $${paramIndex}`;
      countQuery += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (start_date) {
      query += ` AND collection_date >= $${paramIndex}`;
      countQuery += ` AND collection_date >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }

    if (end_date) {
      query += ` AND collection_date <= $${paramIndex}`;
      countQuery += ` AND collection_date <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }

    query += ` ORDER BY collection_date ASC, collection_time ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(Number(limit), offset);

    const schedulesQuery = await pool.query(query, params);
    const countResult = await pool.query(countQuery, params.slice(0, -2));

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      message: 'Schedules retrieved successfully',
      data: schedulesQuery.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get schedule by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { id } = req.params;

    const scheduleQuery = await pool.query('SELECT * FROM schedules WHERE id = $1', [id]);

    if (scheduleQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.json({
      success: true,
      message: 'Schedule retrieved successfully',
      data: scheduleQuery.rows[0]
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new schedule (admin only)
router.post('/', authenticateToken, [
  body('title').isLength({ min: 1, max: 100 }).withMessage('Title must be 1-100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description too long'),
  body('waste_type').isIn(['biodegradable', 'non-biodegradable', 'recyclable']).withMessage('Invalid waste type'),
  body('collection_date').isISO8601().withMessage('Invalid date format'),
  body('collection_time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:MM)')
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

    const { title, description, waste_type, collection_date, collection_time } = req.body;

    const newScheduleQuery = await pool.query(
      'INSERT INTO schedules (title, description, waste_type, collection_date, collection_time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, waste_type, collection_date, collection_time]
    );

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: newScheduleQuery.rows[0]
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update schedule
router.put('/:id', authenticateToken, [
  body('title').optional().isLength({ min: 1, max: 100 }).withMessage('Title must be 1-100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description too long'),
  body('waste_type').optional().isIn(['biodegradable', 'non-biodegradable', 'recyclable']).withMessage('Invalid waste type'),
  body('collection_date').optional().isISO8601().withMessage('Invalid date format'),
  body('collection_time').optional().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:MM)'),
  body('status').optional().isIn(['scheduled', 'completed', 'cancelled']).withMessage('Invalid status')
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
    const { title, description, waste_type, collection_date, collection_time, status } = req.body;

    const updateFields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramIndex++}`);
      params.push(title);
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramIndex++}`);
      params.push(description);
    }
    if (waste_type !== undefined) {
      updateFields.push(`waste_type = $${paramIndex++}`);
      params.push(waste_type);
    }
    if (collection_date !== undefined) {
      updateFields.push(`collection_date = $${paramIndex++}`);
      params.push(collection_date);
    }
    if (collection_time !== undefined) {
      updateFields.push(`collection_time = $${paramIndex++}`);
      params.push(collection_time);
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

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const updateQuery = `
      UPDATE schedules 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.json({
      success: true,
      message: 'Schedule updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete schedule
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { id } = req.params;

    const deleteQuery = await pool.query('DELETE FROM schedules WHERE id = $1 RETURNING *', [id]);

    if (deleteQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.json({
      success: true,
      message: 'Schedule deleted successfully'
    });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
