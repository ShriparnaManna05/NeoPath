const express = require('express');
const { Skill } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const skills = await Skill.findAll({
      order: [['skill_name', 'ASC']]
    });
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ message: 'Failed to fetch skills' });
  }
});

module.exports = router;
