const express = require('express');
const { body, validationResult } = require('express-validator');
const { CareerPath, CareerRecommendation, Student, StudentAssessment, StudentSkill, Skill, Assessment } = require('../models');
const { authenticateToken, requireStudent, requireCounsellorOrAdmin } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get all career paths
router.get('/paths', async (req, res) => {
  try {
    const { category, minSalary, maxSalary, outlook } = req.query;
    
    let whereClause = { is_active: true };
    
    if (category) {
      whereClause.required_education = category;
    }
    
    if (minSalary) {
      whereClause.salary_range_min = { [Op.gte]: minSalary };
    }
    
    if (maxSalary) {
      whereClause.salary_range_max = { [Op.lte]: maxSalary };
    }
    
    if (outlook) {
      whereClause.job_market_outlook = outlook;
    }

    const careers = await CareerPath.findAll({
      where: whereClause,
      order: [['title', 'ASC']]
    });

    res.json(careers);
  } catch (error) {
    console.error('Error fetching career paths:', error);
    res.status(500).json({ message: 'Failed to fetch career paths' });
  }
});

// Get specific career path
router.get('/paths/:careerId', async (req, res) => {
  try {
    const { careerId } = req.params;
    const career = await CareerPath.findByPk(careerId);

    if (!career) {
      return res.status(404).json({ message: 'Career path not found' });
    }

    res.json(career);
  } catch (error) {
    console.error('Error fetching career path:', error);
    res.status(500).json({ message: 'Failed to fetch career path' });
  }
});

// Get career recommendations for student
router.get('/recommendations/student', [
  authenticateToken,
  requireStudent
], async (req, res) => {
  try {
    const studentId = req.user.Student.student_id;
    
    const recommendations = await CareerRecommendation.findAll({
      where: { student_id: studentId },
      include: [{
        model: CareerPath,
        attributes: ['title', 'description', 'salary_range_min', 'salary_range_max', 'job_market_outlook', 'required_skills']
      }],
      order: [['match_score', 'DESC']]
    });

    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching career recommendations:', error);
    res.status(500).json({ message: 'Failed to fetch career recommendations' });
  }
});

// Generate AI-powered career recommendations
router.post('/recommendations/generate', [
  authenticateToken,
  requireStudent
], async (req, res) => {
  try {
    const studentId = req.user.Student.student_id;
    
    // Get student's assessment results
    const assessments = await StudentAssessment.findAll({
      where: { 
        student_id: studentId,
        status: 'completed'
      },
      include: [{
        model: Assessment,
        include: [{
          model: require('../models').AssessmentType
        }]
      }]
    });

    // Get student's skills
    const studentSkills = await StudentSkill.findAll({
      where: { student_id: studentId },
      include: [{
        model: Skill
      }]
    });

    // Get all career paths
    const allCareers = await CareerPath.findAll({
      where: { is_active: true }
    });

    // Generate recommendations using AI algorithm
    const recommendations = await generateCareerRecommendations(
      assessments, 
      studentSkills, 
      allCareers
    );

    // Save recommendations to database
    const savedRecommendations = [];
    for (const rec of recommendations) {
      const recommendation = await CareerRecommendation.create({
        student_id: studentId,
        career_id: rec.career_id,
        match_score: rec.match_score,
        reasoning: rec.reasoning,
        status: 'pending'
      });
      savedRecommendations.push(recommendation);
    }

    res.json({
      message: 'Career recommendations generated successfully',
      recommendations: savedRecommendations
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ message: 'Failed to generate recommendations' });
  }
});

// Update recommendation status
router.put('/recommendations/:recommendationId', [
  authenticateToken,
  requireStudent,
  body('status').isIn(['accepted', 'rejected'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recommendationId } = req.params;
    const { status } = req.body;
    const studentId = req.user.Student.student_id;

    const recommendation = await CareerRecommendation.findOne({
      where: {
        recommendation_id: recommendationId,
        student_id: studentId
      }
    });

    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }

    await recommendation.update({ status });

    res.json({
      message: 'Recommendation status updated successfully',
      recommendation
    });
  } catch (error) {
    console.error('Error updating recommendation:', error);
    res.status(500).json({ message: 'Failed to update recommendation' });
  }
});

// Create manual recommendation (Counsellor/Admin)
router.post('/recommendations', [
  authenticateToken,
  requireCounsellorOrAdmin,
  body('studentId').isInt(),
  body('careerId').isInt(),
  body('reasoning').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { studentId, careerId, reasoning, matchScore = 85 } = req.body;
    const counsellorId = req.user.Counsellor?.counsellor_id;

    // Verify student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Verify career exists
    const career = await CareerPath.findByPk(careerId);
    if (!career) {
      return res.status(404).json({ message: 'Career path not found' });
    }

    const recommendation = await CareerRecommendation.create({
      student_id: studentId,
      career_id: careerId,
      counsellor_id: counsellorId,
      match_score: matchScore,
      reasoning,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Recommendation created successfully',
      recommendation
    });
  } catch (error) {
    console.error('Error creating recommendation:', error);
    res.status(500).json({ message: 'Failed to create recommendation' });
  }
});

// Get career analytics for admin
router.get('/analytics', [
  authenticateToken,
  requireCounsellorOrAdmin
], async (req, res) => {
  try {
    const { Op } = require('sequelize');
    
    // Get popular career paths
    const popularCareers = await CareerRecommendation.findAll({
      attributes: [
        'career_id',
        [sequelize.fn('COUNT', sequelize.col('career_id')), 'recommendation_count'],
        [sequelize.fn('AVG', sequelize.col('match_score')), 'avg_match_score']
      ],
      include: [{
        model: CareerPath,
        attributes: ['title', 'salary_range_min', 'salary_range_max']
      }],
      group: ['career_id'],
      order: [[sequelize.fn('COUNT', sequelize.col('career_id')), 'DESC']],
      limit: 10
    });

    // Get recommendation status distribution
    const statusDistribution = await CareerRecommendation.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count']
      ],
      group: ['status']
    });

    // Get average match scores by career type
    const careerTypeScores = await CareerRecommendation.findAll({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('match_score')), 'avg_score']
      ],
      include: [{
        model: CareerPath,
        attributes: ['required_education']
      }],
      group: ['career_path.required_education']
    });

    res.json({
      popular_careers: popularCareers,
      status_distribution: statusDistribution,
      career_type_scores: careerTypeScores
    });
  } catch (error) {
    console.error('Error fetching career analytics:', error);
    res.status(500).json({ message: 'Failed to fetch career analytics' });
  }
});

// AI-powered career recommendation algorithm
async function generateCareerRecommendations(assessments, studentSkills, allCareers) {
  const recommendations = [];
  
  for (const career of allCareers) {
    let matchScore = 0;
    let reasoning = [];
    
    // Calculate skill match (40% weight)
    const requiredSkills = career.required_skills || [];
    const studentSkillNames = studentSkills.map(ss => ss.Skill.skill_name);
    const skillMatches = requiredSkills.filter(skill => 
      studentSkillNames.includes(skill)
    );
    
    if (requiredSkills.length > 0) {
      const skillMatchPercentage = (skillMatches.length / requiredSkills.length) * 100;
      matchScore += skillMatchPercentage * 0.4;
      reasoning.push(`Skills match: ${skillMatchPercentage.toFixed(1)}%`);
    }
    
    // Calculate assessment match (35% weight)
    let assessmentScore = 0;
    let assessmentCount = 0;
    
    for (const assessment of assessments) {
      if (assessment.percentage !== null) {
        assessmentScore += assessment.percentage;
        assessmentCount++;
      }
    }
    
    if (assessmentCount > 0) {
      const avgAssessmentScore = assessmentScore / assessmentCount;
      matchScore += avgAssessmentScore * 0.35;
      reasoning.push(`Assessment performance: ${avgAssessmentScore.toFixed(1)}%`);
    }
    
    // Calculate salary expectation match (15% weight)
    // This is a simplified calculation - in reality, you'd consider student preferences
    const midSalary = (career.salary_range_min + career.salary_range_max) / 2;
    if (midSalary > 0) {
      // Assume higher salary = higher expectation, give bonus points
      const salaryScore = Math.min(100, (midSalary / 100000) * 100);
      matchScore += salaryScore * 0.15;
      reasoning.push(`Salary range: $${career.salary_range_min.toLocaleString()} - $${career.salary_range_max.toLocaleString()}`);
    }
    
    // Calculate market outlook match (10% weight)
    const outlookScores = {
      'Excellent': 100,
      'Good': 75,
      'Fair': 50,
      'Poor': 25
    };
    
    if (career.job_market_outlook) {
      const outlookScore = outlookScores[career.job_market_outlook] || 50;
      matchScore += outlookScore * 0.1;
      reasoning.push(`Market outlook: ${career.job_market_outlook}`);
    }
    
    // Only include careers with match score > 0
    if (matchScore > 0) {
      recommendations.push({
        career_id: career.career_id,
        match_score: Math.min(100, matchScore),
        reasoning: reasoning.join('; ')
      });
    }
  }
  
  // Sort by match score and return top 10
  return recommendations
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 10);
}

module.exports = router;
