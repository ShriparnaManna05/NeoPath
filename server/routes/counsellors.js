const express = require('express');
const { body, validationResult } = require('express-validator');
const { Counsellor, User, Session, Student } = require('../models');
const { authenticateToken, requireCounsellor, requireCounsellorOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get counsellor profile
router.get('/profile', [
  authenticateToken,
  requireCounsellor
], async (req, res) => {
  try {
    const counsellorId = req.user.Counsellor.counsellor_id;
    
    const counsellor = await Counsellor.findByPk(counsellorId, {
      include: [{
        model: User,
        attributes: ['email', 'is_active', 'created_at']
      }]
    });

    res.json(counsellor);
  } catch (error) {
    console.error('Error fetching counsellor profile:', error);
    res.status(500).json({ message: 'Failed to fetch counsellor profile' });
  }
});

// Update counsellor profile
router.put('/profile', [
  authenticateToken,
  requireCounsellor,
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('specialization').optional().trim(),
  body('experienceYears').optional().isInt({ min: 0 }),
  body('qualifications').optional().trim(),
  body('bio').optional().trim(),
  body('hourlyRate').optional().isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const counsellorId = req.user.Counsellor.counsellor_id;
    const updateData = {};
    
    const allowedFields = [
      'first_name', 'last_name', 'specialization', 'experience_years',
      'qualifications', 'bio', 'hourly_rate'
    ];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    await Counsellor.update(updateData, {
      where: { counsellor_id: counsellorId }
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating counsellor profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Get counsellor dashboard
router.get('/dashboard', [
  authenticateToken,
  requireCounsellor
], async (req, res) => {
  try {
    const counsellorId = req.user.Counsellor.counsellor_id;
    
    // Get upcoming sessions
    const upcomingSessions = await Session.findAll({
      where: {
        counsellor_id: counsellorId,
        scheduled_at: {
          [require('sequelize').Op.gte]: new Date()
        },
        status: 'scheduled'
      },
      include: [{
        model: Student,
        include: [{
          model: User,
          attributes: ['email']
        }]
      }],
      order: [['scheduled_at', 'ASC']],
      limit: 10
    });

    // Get recent sessions
    const recentSessions = await Session.findAll({
      where: {
        counsellor_id: counsellorId,
        status: 'completed'
      },
      include: [{
        model: Student,
        include: [{
          model: User,
          attributes: ['email']
        }]
      }],
      order: [['scheduled_at', 'DESC']],
      limit: 5
    });

    // Get session statistics
    const stats = await Session.findAll({
      where: { counsellor_id: counsellorId },
      attributes: [
        [require('sequelize').fn('COUNT', require('sequelize').col('session_id')), 'total_sessions'],
        [require('sequelize').fn('COUNT', require('sequelize').literal('CASE WHEN status = "completed" THEN 1 END')), 'completed_sessions'],
        [require('sequelize').fn('AVG', require('sequelize').col('rating')), 'avg_rating']
      ]
    });

    res.json({
      upcoming_sessions: upcomingSessions,
      recent_sessions: recentSessions,
      statistics: stats[0]
    });
  } catch (error) {
    console.error('Error fetching counsellor dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

// Get all counsellors (Admin only)
router.get('/', [
  authenticateToken
], async (req, res) => {
  try {
    const counsellors = await Counsellor.findAll({
      include: [{
        model: User,
        attributes: ['email', 'is_active', 'created_at']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json(counsellors);
  } catch (error) {
    console.error('Error fetching counsellors:', error);
    res.status(500).json({ message: 'Failed to fetch counsellors' });
  }
});

module.exports = router;
