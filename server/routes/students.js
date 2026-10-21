const express = require('express');
const { body, validationResult } = require('express-validator');
const { Student, User, StudentSkill, Skill, StudentAssessment, Assessment, CareerRecommendation, CareerPath } = require('../models');
const { authenticateToken, requireStudent, requireCounsellorOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get student profile
router.get('/profile', [
  authenticateToken,
  requireStudent
], async (req, res) => {
  try {
    const studentId = req.user.Student.student_id;
    
    const student = await Student.findByPk(studentId, {
      include: [
        {
          model: User,
          attributes: ['email', 'is_active', 'createdAt']
        },
        {
          model: StudentSkill,
          include: [{
            model: Skill
          }]
        }
      ]
    });

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Failed to fetch student profile' });
  }
});

// Update student profile
router.put('/profile', [
  authenticateToken,
  requireStudent,
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('currentEducationLevel').optional().trim(),
  body('interests').optional().trim(),
  body('goals').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const studentId = req.user.Student.student_id;
    const updateData = {};
    
    const allowedFields = [
      'first_name', 'last_name', 'phone', 'address', 
      'current_education_level', 'interests', 'goals'
    ];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    await Student.update(updateData, {
      where: { student_id: studentId }
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating student profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Get student skills
router.get('/skills', [
  authenticateToken,
  requireStudent
], async (req, res) => {
  try {
    const studentId = req.user.Student.student_id;
    
    const skills = await StudentSkill.findAll({
      where: { student_id: studentId },
      include: [{
        model: Skill
      }]
    });

    res.json(skills);
  } catch (error) {
    console.error('Error fetching student skills:', error);
    res.status(500).json({ message: 'Failed to fetch skills' });
  }
});

// Add skill to student
router.post('/skills', [
  authenticateToken,
  requireStudent,
  body('skillId').isInt(),
  body('proficiencyLevel').isIn(['beginner', 'intermediate', 'advanced', 'expert']),
  body('yearsOfExperience').isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { skillId, proficiencyLevel, yearsOfExperience } = req.body;
    const studentId = req.user.Student.student_id;

    // Check if skill exists
    const skill = await Skill.findByPk(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Check if student already has this skill
    const existingSkill = await StudentSkill.findOne({
      where: { student_id: studentId, skill_id: skillId }
    });

    if (existingSkill) {
      return res.status(400).json({ message: 'Student already has this skill' });
    }

    const studentSkill = await StudentSkill.create({
      student_id: studentId,
      skill_id: skillId,
      proficiency_level: proficiencyLevel,
      years_of_experience: yearsOfExperience
    });

    res.status(201).json({
      message: 'Skill added successfully',
      studentSkill
    });
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(500).json({ message: 'Failed to add skill' });
  }
});

// Update student skill
router.put('/skills/:skillId', [
  authenticateToken,
  requireStudent,
  body('proficiencyLevel').isIn(['beginner', 'intermediate', 'advanced', 'expert']),
  body('yearsOfExperience').isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { skillId } = req.params;
    const { proficiencyLevel, yearsOfExperience } = req.body;
    const studentId = req.user.Student.student_id;

    const studentSkill = await StudentSkill.findOne({
      where: { student_id: studentId, skill_id: skillId }
    });

    if (!studentSkill) {
      return res.status(404).json({ message: 'Student skill not found' });
    }

    await studentSkill.update({
      proficiency_level: proficiencyLevel,
      years_of_experience: yearsOfExperience
    });

    res.json({ message: 'Skill updated successfully' });
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ message: 'Failed to update skill' });
  }
});

// Remove skill from student
router.delete('/skills/:skillId', [
  authenticateToken,
  requireStudent
], async (req, res) => {
  try {
    const { skillId } = req.params;
    const studentId = req.user.Student.student_id;

    const studentSkill = await StudentSkill.findOne({
      where: { student_id: studentId, skill_id: skillId }
    });

    if (!studentSkill) {
      return res.status(404).json({ message: 'Student skill not found' });
    }

    await studentSkill.destroy();

    res.json({ message: 'Skill removed successfully' });
  } catch (error) {
    console.error('Error removing skill:', error);
    res.status(500).json({ message: 'Failed to remove skill' });
  }
});

// Get student dashboard data
router.get('/dashboard', [
  authenticateToken,
  requireStudent
], async (req, res) => {
  try {
    const studentId = req.user.Student.student_id;
    
    // Get recent assessments
    const recentAssessments = await StudentAssessment.findAll({
      where: { student_id: studentId },
      include: [{
        model: Assessment,
        include: [{
          model: require('../models').AssessmentType,
          attributes: ['type_name']
        }]
      }],
      order: [['started_at', 'DESC']],
      limit: 5
    });

    // Get career recommendations
    const recommendations = await CareerRecommendation.findAll({
      where: { student_id: studentId },
      include: [{
        model: CareerPath,
        attributes: ['title', 'description', 'salary_range_min', 'salary_range_max']
      }],
      order: [['match_score', 'DESC']],
      limit: 5
    });

    // Get upcoming sessions
    const upcomingSessions = await require('../models').Session.findAll({
      where: {
        student_id: studentId,
        scheduled_at: {
          [require('sequelize').Op.gte]: new Date()
        },
        status: 'scheduled'
      },
      include: [{
        model: require('../models').Counsellor,
        include: [{
          model: User,
          attributes: ['email']
        }]
      }],
      order: [['scheduled_at', 'ASC']],
      limit: 5
    });

    // Get skills summary
    const skillsSummary = await StudentSkill.findAll({
      where: { student_id: studentId },
      include: [{
        model: Skill,
        attributes: ['skill_name', 'category']
      }],
      attributes: ['proficiency_level', 'years_of_experience']
    });

    res.json({
      recent_assessments: recentAssessments,
      career_recommendations: recommendations,
      upcoming_sessions: upcomingSessions,
      skills_summary: skillsSummary
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

// Get all students (Admin/Counsellor only)
router.get('/', [
  authenticateToken,
  requireCounsellorOrAdmin
], async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    if (search) {
      whereClause[require('sequelize').Op.or] = [
        { first_name: { [require('sequelize').Op.like]: `%${search}%` } },
        { last_name: { [require('sequelize').Op.like]: `%${search}%` } }
      ];
    }

    const students = await Student.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        attributes: ['email', 'is_active', 'created_at']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      students: students.rows,
      total: students.count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(students.count / limit)
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
});

module.exports = router;
