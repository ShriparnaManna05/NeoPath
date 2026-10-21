const express = require('express');
const { body, validationResult } = require('express-validator');
const { Session, Student, Counsellor, User } = require('../models');
const { authenticateToken, requireStudent, requireCounsellor, requireCounsellorOrAdmin } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get sessions for current user
router.get('/my-sessions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const userRole = req.user.role;
    
    let whereClause = {};
    let includeClause = [];
    
    if (userRole === 'student') {
      whereClause.student_id = req.user.Student.student_id;
      includeClause = [
        {
          model: Counsellor,
          include: [{
            model: User,
            attributes: ['email']
          }]
        }
      ];
    } else if (userRole === 'counsellor') {
      whereClause.counsellor_id = req.user.Counsellor.counsellor_id;
      includeClause = [
        {
          model: Student,
          include: [{
            model: User,
            attributes: ['email']
          }]
        }
      ];
    } else if (userRole === 'admin') {
      includeClause = [
        {
          model: Student,
          include: [{
            model: User,
            attributes: ['email']
          }]
        },
        {
          model: Counsellor,
          include: [{
            model: User,
            attributes: ['email']
          }]
        }
      ];
    }

    const sessions = await Session.findAll({
      where: whereClause,
      include: includeClause,
      order: [['scheduled_at', 'DESC']]
    });

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Failed to fetch sessions' });
  }
});

// Get specific session
router.get('/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.user_id;
    const userRole = req.user.role;
    
    let whereClause = { session_id: sessionId };
    
    // Add role-based filtering
    if (userRole === 'student') {
      whereClause.student_id = req.user.Student.student_id;
    } else if (userRole === 'counsellor') {
      whereClause.counsellor_id = req.user.Counsellor.counsellor_id;
    }

    const session = await Session.findOne({
      where: whereClause,
      include: [
        {
          model: Student,
          include: [{
            model: User,
            attributes: ['email']
          }]
        },
        {
          model: Counsellor,
          include: [{
            model: User,
            attributes: ['email']
          }]
        }
      ]
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ message: 'Failed to fetch session' });
  }
});

// Create new session
router.post('/', [
  authenticateToken,
  body('counsellorId').isInt(),
  body('sessionType').isIn(['one_on_one', 'group', 'assessment_review']),
  body('sessionMode').isIn(['online', 'offline']),
  body('scheduledAt').isISO8601(),
  body('durationMinutes').isInt(),
  body('title').optional().trim(),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      counsellorId,
      sessionType,
      sessionMode,
      scheduledAt,
      durationMinutes,
      title,
      description,
      meetingLink,
      location
    } = req.body;
    
    // If student, use their own ID. If admin/counsellor, require studentId in body.
    let studentId = req.body.studentId;
    if (req.user.role === 'student') {
      studentId = req.user.Student.student_id;
    } else if (!studentId) {
      return res.status(400).json({ message: 'studentId is required for counsellors/admins' });
    }

    // Verify student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Verify counsellor exists
    const counsellor = await Counsellor.findByPk(counsellorId);
    if (!counsellor) {
      return res.status(404).json({ message: 'Counsellor not found' });
    }

    // Check for scheduling conflicts
    const conflict = await Session.findOne({
      where: {
        counsellor_id: counsellorId,
        scheduled_at: {
          [Op.between]: [
            new Date(scheduledAt),
            new Date(new Date(scheduledAt).getTime() + durationMinutes * 60000)
          ]
        },
        status: {
          [Op.in]: ['scheduled', 'in_progress']
        }
      }
    });

    if (conflict) {
      return res.status(400).json({ 
        message: 'Counsellor has a conflicting session at this time' 
      });
    }

    const session = await Session.create({
      student_id: studentId,
      counsellor_id: counsellorId,
      session_type: sessionType,
      session_mode: sessionMode,
      scheduled_at: scheduledAt,
      duration_minutes: durationMinutes,
      title,
      description,
      meeting_link: meetingLink,
      location
    });

    res.status(201).json({
      message: 'Session created successfully',
      session
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Failed to create session' });
  }
});

// Update session
router.put('/:sessionId', [
  authenticateToken,
  body('status').optional().isIn(['scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled']),
  body('notes').optional().trim(),
  body('feedback').optional().trim(),
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('scheduledAt').optional().isISO8601(),
  body('durationMinutes').optional().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sessionId } = req.params;
    const userId = req.user.user_id;
    const userRole = req.user.role;
    
    let whereClause = { session_id: sessionId };
    
    // Add role-based filtering
    if (userRole === 'student') {
      whereClause.student_id = req.user.Student.student_id;
    } else if (userRole === 'counsellor') {
      whereClause.counsellor_id = req.user.Counsellor.counsellor_id;
    }

    const session = await Session.findOne({ where: whereClause });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const updateData = {};
    const allowedFields = ['status', 'notes', 'feedback', 'rating', 'scheduled_at', 'duration_minutes'];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === 'scheduled_at') {
          updateData.scheduled_at = req.body.scheduledAt;
        } else if (field === 'duration_minutes') {
          updateData.duration_minutes = req.body.durationMinutes;
        } else {
          updateData[field] = req.body[field];
        }
      }
    }

    await session.update(updateData);

    res.json({
      message: 'Session updated successfully',
      session
    });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ message: 'Failed to update session' });
  }
});

// Cancel session
router.put('/:sessionId/cancel', [
  authenticateToken,
  body('reason').optional().trim()
], async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { reason } = req.body;
    const userId = req.user.user_id;
    const userRole = req.user.role;
    
    let whereClause = { session_id: sessionId };
    
    // Add role-based filtering
    if (userRole === 'student') {
      whereClause.student_id = req.user.Student.student_id;
    } else if (userRole === 'counsellor') {
      whereClause.counsellor_id = req.user.Counsellor.counsellor_id;
    }

    const session = await Session.findOne({ where: whereClause });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed session' });
    }

    await session.update({ 
      status: 'cancelled',
      notes: reason ? `${session.notes || ''}\nCancellation reason: ${reason}`.trim() : session.notes
    });

    res.json({
      message: 'Session cancelled successfully',
      session
    });
  } catch (error) {
    console.error('Error cancelling session:', error);
    res.status(500).json({ message: 'Failed to cancel session' });
  }
});

// Get available time slots for counsellor
router.get('/availability/:counsellorId', async (req, res) => {
  try {
    const { counsellorId } = req.params;
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    // Get counsellor's existing sessions for the date
    const existingSessions = await Session.findAll({
      where: {
        counsellor_id: counsellorId,
        scheduled_at: {
          [Op.between]: [startDate, endDate]
        },
        status: {
          [Op.in]: ['scheduled', 'in_progress']
        }
      },
      attributes: ['scheduled_at', 'duration_minutes']
    });

    // Generate available time slots (every 30 minutes from 9 AM to 6 PM)
    const availableSlots = [];
    const startHour = 9;
    const endHour = 18;
    const slotDuration = 30; // minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const slotTime = new Date(startDate);
        slotTime.setHours(hour, minute, 0, 0);
        
        // Check if this slot conflicts with existing sessions
        const hasConflict = existingSessions.some(session => {
          const sessionStart = new Date(session.scheduled_at);
          const sessionEnd = new Date(sessionStart.getTime() + session.duration_minutes * 60000);
          const slotEnd = new Date(slotTime.getTime() + slotDuration * 60000);
          
          return (slotTime < sessionEnd && slotEnd > sessionStart);
        });

        if (!hasConflict) {
          availableSlots.push({
            time: slotTime.toISOString(),
            duration: slotDuration
          });
        }
      }
    }

    res.json({
      counsellor_id: counsellorId,
      date: date,
      available_slots: availableSlots
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ message: 'Failed to fetch availability' });
  }
});

// Get session statistics
router.get('/stats/overview', [
  authenticateToken,
  requireCounsellorOrAdmin
], async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const stats = await Session.findAll({
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

    // Get sessions by type
    const sessionsByType = await Session.findAll({
      attributes: [
        'session_type',
        [sequelize.fn('COUNT', sequelize.col('session_id')), 'count']
      ],
      where: {
        scheduled_at: {
          [Op.gte]: startDate
        }
      },
      group: ['session_type']
    });

    // Get sessions by mode
    const sessionsByMode = await Session.findAll({
      attributes: [
        'session_mode',
        [sequelize.fn('COUNT', sequelize.col('session_id')), 'count']
      ],
      where: {
        scheduled_at: {
          [Op.gte]: startDate
        }
      },
      group: ['session_mode']
    });

    res.json({
      overview: stats[0],
      by_type: sessionsByType,
      by_mode: sessionsByMode,
      period_days: parseInt(period)
    });
  } catch (error) {
    console.error('Error fetching session stats:', error);
    res.status(500).json({ message: 'Failed to fetch session statistics' });
  }
});

module.exports = router;
