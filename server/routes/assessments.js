const express = require('express');
const { body, validationResult } = require('express-validator');
const { Assessment, AssessmentType, Question, StudentAssessment, StudentAnswer, Student } = require('../models');
const { authenticateToken, requireStudent, requireCounsellorOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all assessment types
router.get('/types', async (req, res) => {
  try {
    const types = await AssessmentType.findAll({
      where: { is_active: true },
      order: [['type_name', 'ASC']]
    });
    res.json(types);
  } catch (error) {
    console.error('Error fetching assessment types:', error);
    res.status(500).json({ message: 'Failed to fetch assessment types' });
  }
});

// Get assessments by type
router.get('/type/:typeId', async (req, res) => {
  try {
    const { typeId } = req.params;
    const assessments = await Assessment.findAll({
      where: { 
        type_id: typeId,
        is_active: true 
      },
      include: [{
        model: AssessmentType,
        attributes: ['type_name', 'duration_minutes']
      }],
      order: [['title', 'ASC']]
    });
    res.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ message: 'Failed to fetch assessments' });
  }
});

// Get specific assessment with questions
router.get('/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const assessment = await Assessment.findByPk(assessmentId, {
      include: [
        {
          model: AssessmentType,
          attributes: ['type_name', 'duration_minutes']
        },
        {
          model: Question,
          order: [['order_index', 'ASC']],
          attributes: { exclude: ['correct_answer'] } // Don't send correct answers to client
        }
      ]
    });

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    res.json(assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({ message: 'Failed to fetch assessment' });
  }
});

// Start assessment attempt
router.post('/:assessmentId/start', [
  authenticateToken,
  requireStudent
], async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const studentId = req.user.Student.student_id;

    // Check if assessment exists
    const assessment = await Assessment.findByPk(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // Check if student already has an active attempt
    const activeAttempt = await StudentAssessment.findOne({
      where: {
        student_id: studentId,
        assessment_id: assessmentId,
        status: 'in_progress'
      }
    });

    if (activeAttempt) {
      return res.status(400).json({ 
        message: 'You already have an active attempt for this assessment',
        attempt_id: activeAttempt.attempt_id
      });
    }

    // Create new attempt
    const attempt = await StudentAssessment.create({
      student_id: studentId,
      assessment_id: assessmentId,
      started_at: new Date()
    });

    res.status(201).json({
      message: 'Assessment started',
      attempt_id: attempt.attempt_id,
      started_at: attempt.started_at
    });
  } catch (error) {
    console.error('Error starting assessment:', error);
    res.status(500).json({ message: 'Failed to start assessment' });
  }
});

// Submit answer for a question
router.post('/attempts/:attemptId/answers', [
  authenticateToken,
  requireStudent,
  body('questionId').isInt(),
  body('answerText').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { attemptId } = req.params;
    const { questionId, answerText } = req.body;
    const studentId = req.user.Student.student_id;

    // Verify attempt belongs to student
    const attempt = await StudentAssessment.findOne({
      where: {
        attempt_id: attemptId,
        student_id: studentId,
        status: 'in_progress'
      }
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Assessment attempt not found or not active' });
    }

    // Get question details
    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if answer already exists
    const existingAnswer = await StudentAnswer.findOne({
      where: {
        attempt_id: attemptId,
        question_id: questionId
      }
    });

    let answer;
    if (existingAnswer) {
      // Update existing answer
      answer = await existingAnswer.update({
        answer_text: answerText,
        answered_at: new Date()
      });
    } else {
      // Create new answer
      answer = await StudentAnswer.create({
        attempt_id: attemptId,
        question_id: questionId,
        answer_text: answerText,
        answered_at: new Date()
      });
    }

    res.json({
      message: 'Answer submitted successfully',
      answer_id: answer.answer_id
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ message: 'Failed to submit answer' });
  }
});

// Complete assessment
router.post('/attempts/:attemptId/complete', [
  authenticateToken,
  requireStudent
], async (req, res) => {
  try {
    const { attemptId } = req.params;
    const studentId = req.user.Student.student_id;

    // Get attempt
    const attempt = await StudentAssessment.findOne({
      where: {
        attempt_id: attemptId,
        student_id: studentId,
        status: 'in_progress'
      },
      include: [{
        model: Assessment,
        include: [{
          model: Question
        }]
      }]
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Assessment attempt not found or not active' });
    }

    // Get all answers for this attempt
    const answers = await StudentAnswer.findAll({
      where: { attempt_id: attemptId },
      include: [{
        model: Question
      }]
    });

    // Calculate score
    let totalScore = 0;
    let correctAnswers = 0;

    for (const answer of answers) {
      const question = answer.Question;
      let isCorrect = false;
      let pointsEarned = 0;

      if (question.question_type === 'multiple_choice') {
        isCorrect = answer.answer_text === question.correct_answer;
        if (isCorrect) pointsEarned = question.points;
      } else if (question.question_type === 'true_false') {
        isCorrect = answer.answer_text.toLowerCase() === question.correct_answer.toLowerCase();
        if (isCorrect) pointsEarned = question.points;
      } else if (question.question_type === 'rating_scale') {
        const ratingMap = { 'Strongly Disagree': 1, 'Disagree': 2, 'Neutral': 3, 'Agree': 4, 'Strongly Agree': 5 };
        const rating = ratingMap[answer.answer_text] || 3;
        pointsEarned = (rating / 5) * question.points;
        isCorrect = true;
      } else if (question.question_type === 'text') {
        pointsEarned = question.points * 0.8; 
        isCorrect = true;
      }

      if (isCorrect) {
        correctAnswers++;
      }
      totalScore += pointsEarned;

      // Update answer with correctness and points
      await answer.update({
        is_correct: isCorrect,
        points_earned: pointsEarned
      });
    }

    // Calculate percentage
    const totalPossibleScore = attempt.Assessment.Questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = totalPossibleScore > 0 ? (totalScore / totalPossibleScore) * 100 : 0;

    // Calculate time taken
    const timeTaken = Math.round((new Date() - new Date(attempt.started_at)) / 60000); // in minutes

    // Update attempt
    await attempt.update({
      completed_at: new Date(),
      total_score: totalScore,
      percentage: percentage,
      status: 'completed',
      time_taken_minutes: timeTaken
    });

    res.json({
      message: 'Assessment completed successfully',
      total_score: totalScore,
      percentage: percentage.toFixed(2),
      correct_answers: correctAnswers,
      total_questions: attempt.Assessment.Questions.length,
      time_taken_minutes: timeTaken
    });
  } catch (error) {
    console.error('Error completing assessment:', error);
    res.status(500).json({ message: 'Failed to complete assessment' });
  }
});

// Get student's assessment history
router.get('/history/student', [
  authenticateToken,
  requireStudent
], async (req, res) => {
  try {
    const studentId = req.user.Student.student_id;
    const attempts = await StudentAssessment.findAll({
      where: { student_id: studentId },
      include: [{
        model: Assessment,
        include: [{
          model: AssessmentType,
          attributes: ['type_name']
        }]
      }],
      order: [['started_at', 'DESC']]
    });

    res.json(attempts);
  } catch (error) {
    console.error('Error fetching assessment history:', error);
    res.status(500).json({ message: 'Failed to fetch assessment history' });
  }
});

// Get specific attempt results
router.get('/attempts/:attemptId/results', [
  authenticateToken,
  requireStudent
], async (req, res) => {
  try {
    const { attemptId } = req.params;
    const studentId = req.user.Student.student_id;

    const attempt = await StudentAssessment.findOne({
      where: {
        attempt_id: attemptId,
        student_id: studentId
      },
      include: [
        {
          model: Assessment,
          include: [{
            model: AssessmentType,
            attributes: ['type_name']
          }]
        },
        {
          model: StudentAnswer,
          include: [{
            model: Question
          }]
        }
      ]
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Assessment attempt not found' });
    }

    res.json(attempt);
  } catch (error) {
    console.error('Error fetching attempt results:', error);
    res.status(500).json({ message: 'Failed to fetch attempt results' });
  }
});

// Create new assessment (Admin/Counsellor only)
router.post('/', [
  authenticateToken,
  requireCounsellorOrAdmin,
  body('typeId').isInt(),
  body('title').notEmpty().trim(),
  body('description').optional().trim(),
  body('instructions').optional().trim(),
  body('totalScore').isInt(),
  body('passingScore').isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { typeId, title, description, instructions, totalScore, passingScore } = req.body;

    const assessment = await Assessment.create({
      type_id: typeId,
      title,
      description,
      instructions,
      total_score: totalScore,
      passing_score: passingScore
    });

    res.status(201).json({
      message: 'Assessment created successfully',
      assessment
    });
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({ message: 'Failed to create assessment' });
  }
});

// Add question to assessment (Admin/Counsellor only)
router.post('/:assessmentId/questions', [
  authenticateToken,
  requireCounsellorOrAdmin,
  body('questionText').notEmpty().trim(),
  body('questionType').isIn(['multiple_choice', 'true_false', 'rating_scale', 'text']),
  body('options').optional().isArray(),
  body('correctAnswer').optional().trim(),
  body('points').isInt(),
  body('orderIndex').isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { assessmentId } = req.params;
    const { questionText, questionType, options, correctAnswer, points, orderIndex } = req.body;

    // Verify assessment exists
    const assessment = await Assessment.findByPk(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const question = await Question.create({
      assessment_id: assessmentId,
      question_text: questionText,
      question_type: questionType,
      options: options || null,
      correct_answer: correctAnswer || null,
      points,
      order_index: orderIndex
    });

    res.status(201).json({
      message: 'Question added successfully',
      question
    });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ message: 'Failed to add question' });
  }
});

module.exports = router;
