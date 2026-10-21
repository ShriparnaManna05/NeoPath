const express = require('express');
const { body, validationResult } = require('express-validator');
const { Notification, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user notifications
router.get('/', [
  authenticateToken
], async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { unreadOnly = false } = req.query;
    
    let whereClause = { user_id: userId };
    if (unreadOnly === 'true') {
      whereClause.is_read = false;
    }

    const notifications = await Notification.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit: 50
    });

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/:notificationId/read', [
  authenticateToken
], async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.user_id;

    const notification = await Notification.findOne({
      where: {
        notification_id: notificationId,
        user_id: userId
      }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.update({ is_read: true });

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/read-all', [
  authenticateToken
], async (req, res) => {
  try {
    const userId = req.user.user_id;

    await Notification.update(
      { is_read: true },
      { where: { user_id: userId, is_read: false } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Failed to mark all notifications as read' });
  }
});

// Create notification (Admin/Counsellor only)
router.post('/', [
  authenticateToken,
  body('userId').isInt(),
  body('title').notEmpty().trim(),
  body('message').notEmpty().trim(),
  body('type').isIn(['session_reminder', 'assessment_due', 'career_recommendation', 'system', 'message']),
  body('actionUrl').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, title, message, type, actionUrl } = req.body;

    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notification = await Notification.create({
      user_id: userId,
      title,
      message,
      type,
      action_url: actionUrl
    });

    res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Failed to create notification' });
  }
});

module.exports = router;
