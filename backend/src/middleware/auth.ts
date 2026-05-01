import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { AuthRequest, User } from '../types';

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const sessionQuery = await pool.query(
      'SELECT * FROM user_sessions WHERE user_id = $1 AND expires_at > NOW()',
      [decoded.userId]
    );

    if (sessionQuery.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session'
      });
    }

    const userQuery = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userQuery.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    (req as AuthRequest).user = userQuery.rows[0];
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

const requireUserType = (userType: 'resident' | 'collector') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (user.user_type !== userType) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${userType} access required.`
      });
    }

    next();
  };
};

export { authenticateToken, requireUserType };
