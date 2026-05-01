import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import pool from '../config/database';
import { User, OTPCode, AuthRequest, LoginRequest, RegisterRequest, OTPRequest } from '../types';
import { generateOTP, sendOTP } from '../utils/otpService';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Login - Send OTP
router.post('/login', [
  body('phone_number').matches(/^09\d{9}$/).withMessage('Invalid Philippine phone number format')
], async (req: express.Request, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.array()[0].msg
      });
    }

    const { phone_number }: LoginRequest = req.body;

    const userQuery = await pool.query(
      'SELECT * FROM users WHERE phone_number = $1',
      [phone_number]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Phone number not registered'
      });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await pool.query(
      'INSERT INTO otp_codes (phone_number, code, expires_at) VALUES ($1, $2, $3)',
      [phone_number, otp, expiresAt]
    );

    await sendOTP(phone_number, otp);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      data: { expires_in: 600 } // 10 minutes in seconds
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify OTP and get token
router.post('/verify', [
  body('phone_number').matches(/^09\d{9}$/).withMessage('Invalid Philippine phone number format'),
  body('code').isLength({ min: 6, max: 6 }).isNumeric().withMessage('Invalid OTP format')
], async (req: express.Request, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.array()[0].msg
      });
    }

    const { phone_number, code }: OTPRequest = req.body;

    const otpQuery = await pool.query(
      'SELECT * FROM otp_codes WHERE phone_number = $1 AND code = $2 AND is_used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [phone_number, code]
    );

    if (otpQuery.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    await pool.query(
      'UPDATE otp_codes SET is_used = TRUE WHERE id = $1',
      [otpQuery.rows[0].id]
    );

    const userQuery = await pool.query(
      'SELECT * FROM users WHERE phone_number = $1',
      [phone_number]
    );

    const user = userQuery.rows[0];

    const token = jwt.sign(
      { 
        userId: user.id, 
        phone_number: user.phone_number,
        user_type: user.user_type 
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const tokenHash = bcrypt.hashSync(token, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await pool.query(
      'INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [user.id, tokenHash, expiresAt]
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          phone_number: user.phone_number,
          full_name: user.full_name,
          email: user.email,
          user_type: user.user_type,
          address: user.address,
          is_verified: user.is_verified
        }
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Register new user
router.post('/register', [
  body('phone_number').matches(/^09\d{9}$/).withMessage('Invalid Philippine phone number format'),
  body('full_name').isLength({ min: 2, max: 100 }).withMessage('Full name must be 2-100 characters'),
  body('user_type').isIn(['resident', 'collector']).withMessage('Invalid user type'),
  body('email').optional().isEmail().withMessage('Invalid email format')
], async (req: express.Request, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.array()[0].msg
      });
    }

    const { phone_number, full_name, email, user_type, address }: RegisterRequest = req.body;

    const existingUserQuery = await pool.query(
      'SELECT id FROM users WHERE phone_number = $1',
      [phone_number]
    );

    if (existingUserQuery.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already registered'
      });
    }

    const newUserQuery = await pool.query(
      'INSERT INTO users (phone_number, full_name, email, user_type, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [phone_number, full_name, email, user_type, address]
    );

    const user = newUserQuery.rows[0];

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await pool.query(
      'INSERT INTO otp_codes (phone_number, code, expires_at) VALUES ($1, $2, $3)',
      [phone_number, otp, expiresAt]
    );

    await sendOTP(phone_number, otp);

    res.status(201).json({
      success: true,
      message: 'Registration successful. OTP sent for verification.',
      data: {
        user: {
          id: user.id,
          phone_number: user.phone_number,
          full_name: user.full_name,
          email: user.email,
          user_type: user.user_type,
          address: user.address,
          is_verified: user.is_verified
        },
        expires_in: 600
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      await pool.query(
        'DELETE FROM user_sessions WHERE user_id = $1',
        [req.user!.id]
      );
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get current user info
router.get('/me', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        id: req.user!.id,
        phone_number: req.user!.phone_number,
        full_name: req.user!.full_name,
        email: req.user!.email,
        user_type: req.user!.user_type,
        address: req.user!.address,
        is_verified: req.user!.is_verified
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
