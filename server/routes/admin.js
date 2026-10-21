const express = require('express');
const { body, validationResult } = require('express-validator');
const { User, Student, Counsellor, Session, StudentAssessment, CareerRecommendation } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get system overview statistics
router.get('/overview', [
  authenticateToken,
  requireAdmin
], async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get user statistics
    const userStats = await User.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('user_id')), 'count']
      ],
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      },
      group: ['role']
    });

    // Get session statistics
    const sessionStats = await Session.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('session_id')), 'total_sessions'],
        [sequelize.fn('COUNT', sequelize.literal('CASE WHEN status = "completed" THEN 1 END')), 'completed_sessions'],
        [sequelize.fn('COUNT', sequelize.literal('CASE WHEN status = "cancelled" THEN 1 END')), 'cancelled_sessions'],
        [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating']
      ],
      where: {
        scheduled_at: {
          [Op.gte]: startDate
        }
      }
    });

    // Get assessment statistics
    const assessmentStats = await StudentAssessment.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('attempt_id')), 'total_attempts'],
        [sequelize.fn('COUNT', sequelize.literal('CASE WHEN status = "completed" THEN 1 END')), 'completed_attempts'],
        [sequelize.fn('AVG', sequelize.col('percentage')), 'avg_percentage']
      ],
      where: {
        started_at: {
          [Op.gte]: startDate
        }
      }
    });

    // Get career recommendation statistics
    const recommendationStats = await CareerRecommendation.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('recommendation_id')), 'total_recommendations'],
        [sequelize.fn('COUNT', sequelize.literal('CASE WHEN status = "accepted" THEN 1 END')), 'accepted_recommendations'],
        [sequelize.fn('AVG', sequelize.col('match_score')), 'avg_match_score']
      ],
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      }
    });

    res.json({
      user_statistics: userStats,
      session_statistics: sessionStats[0],
      assessment_statistics: assessmentStats[0],
      recommendation_statistics: recommendationStats[0],
      period_days: parseInt(period)
    });
  } catch (error) {
    console.error('Error fetching system overview:', error);
    res.status(500).json({ message: 'Failed to fetch system overview' });
  }
});

// Get all users with pagination
router.get('/users', [
  authenticateToken,
  requireAdmin
], async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    if (role) {
      whereClause.role = role;
    }
    if (search) {
      whereClause.email = {
        [Op.like]: `%${search}%`
      };
    }

    const users = await User.findAndCountAll({
      where: whereClause,
      include: [
        { model: Student, required: false },
        { model: Counsellor, required: false }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      users: users.rows,
      total: users.count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(users.count / limit)
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Update user status
router.put('/users/:userId/status', [
  authenticateToken,
  requireAdmin,
  body('isActive').isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ is_active: isActive });

    res.json({ 
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully` 
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Failed to update user status' });
  }
});

// Get system settings
router.get('/settings', [
  authenticateToken,
  requireAdmin
], async (req, res) => {
  try {
    const settings = await require('../models').SystemSetting.findAll({
      order: [['setting_key', 'ASC']]
    });

    res.json(settings);
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).json({ message: 'Failed to fetch system settings' });
  }
});

// Update system settings
router.put('/settings', [
  authenticateToken,
  requireAdmin,
  body('settings').isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { settings } = req.body;

    for (const setting of settings) {
      await require('../models').SystemSetting.update(
        { setting_value: setting.value },
        { where: { setting_key: setting.key } }
      );
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({ message: 'Failed to update system settings' });
  }
});

module.exports = router;
