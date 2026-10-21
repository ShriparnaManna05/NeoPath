const express = require('express');
const { body, validationResult } = require('express-validator');
const { Message, Session, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get messages for a session
router.get('/session/:sessionId', [
  authenticateToken
], async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.user_id;
    const userRole = req.user.role;
    
    // Verify user has access to this session
    const session = await Session.findOne({
      where: {
        session_id: sessionId,
        [require('sequelize').Op.or]: [
          { student_id: userRole === 'student' ? req.user.Student?.student_id : null },
          { counsellor_id: userRole === 'counsellor' ? req.user.Counsellor?.counsellor_id : null }
        ]
      }
    });

    if (!session && userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied to this session' });
    }

    const messages = await Message.findAll({
      where: { session_id: sessionId },
      include: [{
        model: User,
        attributes: ['email', 'role']
      }],
      order: [['sent_at', 'ASC']]
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Send message
router.post('/', [
  authenticateToken,
  body('sessionId').isInt(),
  body('receiverId').isInt(),
  body('messageText').notEmpty().trim(),
  body('messageType').optional().isIn(['text', 'image', 'file'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sessionId, receiverId, messageText, messageType = 'text', fileUrl } = req.body;
    const senderId = req.user.user_id;

    // Verify session exists and user has access
    const session = await Session.findOne({
      where: {
        session_id: sessionId,
        [require('sequelize').Op.or]: [
          { student_id: req.user.role === 'student' ? req.user.Student?.student_id : null },
          { counsellor_id: req.user.role === 'counsellor' ? req.user.Counsellor?.counsellor_id : null }
        ]
      }
    });

    if (!session && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied to this session' });
    }

    const message = await Message.create({
      session_id: sessionId,
      sender_id: senderId,
      receiver_id: receiverId,
      message_text: messageText,
      message_type: messageType,
      file_url: fileUrl
    });

    res.status(201).json({
      message: 'Message sent successfully',
      messageData: message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Mark message as read
router.put('/:messageId/read', [
  authenticateToken
], async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.user_id;

    const message = await Message.findOne({
      where: {
        message_id: messageId,
        receiver_id: userId
      }
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await message.update({ is_read: true });

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Failed to mark message as read' });
  }
});

module.exports = router;
