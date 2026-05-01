import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database';
import { authenticateToken, requireUserType } from '../middleware/auth';
import { AuthRequest, User } from '../types';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { page = 1, limit = 10, user_type } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = 'SELECT id, phone_number, full_name, email, user_type, address, is_verified, created_at FROM users';
    let countQuery = 'SELECT COUNT(*) FROM users';
    const params: any[] = [];

    if (user_type) {
      query += ' WHERE user_type = $1';
      countQuery += ' WHERE user_type = $1';
      params.push(user_type);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(Number(limit), offset);

    const usersQuery = await pool.query(query, params);
    const countResult = await pool.query(countQuery, user_type ? [user_type] : []);

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: usersQuery.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { id } = req.params;

    const userQuery = await pool.query(
      'SELECT id, phone_number, full_name, email, user_type, address, is_verified, created_at FROM users WHERE id = $1',
      [id]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: userQuery.rows[0]
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('full_name').optional().isLength({ min: 2, max: 100 }).withMessage('Full name must be 2-100 characters'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('address').optional().isLength({ max: 500 }).withMessage('Address too long')
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

    const { full_name, email, address } = req.body;
    const userId = req.user!.id;

    const updateFields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (full_name !== undefined) {
      updateFields.push(`full_name = $${paramIndex++}`);
      params.push(full_name);
    }
    if (email !== undefined) {
      updateFields.push(`email = $${paramIndex++}`);
      params.push(email);
    }
    if (address !== undefined) {
      updateFields.push(`address = $${paramIndex++}`);
      params.push(address);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(userId);

    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, phone_number, full_name, email, user_type, address, is_verified, updated_at
    `;

    const result = await pool.query(updateQuery, params);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { id } = req.params;

    if (req.user!.id === id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const deleteQuery = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (deleteQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
