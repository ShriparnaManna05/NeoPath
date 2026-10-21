const { sequelize } = require('./config/database');
const { Assessment, Question } = require('./models');

async function seedQuestions() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB...');

    // Fetch assessments to attach questions to
    const myersBriggs = await Assessment.findOne({ where: { title: 'Myers-Briggs Career Indicator' } });
    const techLogic = await Assessment.findOne({ where: { title: 'Tech & Logic Aptitude Challenge' } });
    const healthcare = await Assessment.findOne({ where: { title: 'Healthcare Empathy & Anatomy Basics' } });

    if (!myersBriggs || !techLogic || !healthcare) {
      console.log('Assessments not found. Please run seed.js first.');
      process.exit(1);
    }

    const questionsToInsert = [];

    // --- 1. Myers-Briggs Questions (Rating Scale) - Generating 80 questions ---
    console.log('Generating Myers-Briggs questions...');
    const personalityPrompts = [
      "I prefer working in a team rather than working alone.",
      "I enjoy solving complex abstract problems.",
      "I feel drained after spending a lot of time in social settings.",
      "I like to have a strict schedule and stick to it.",
      "I am comfortable taking risks to achieve higher rewards.",
      "I often think about how my actions affect others emotionally.",
      "I prefer a creative, unstructured environment over a corporate one.",
      "I find it easy to introduce myself to strangers."
    ];
    
    // We will loop to generate 80 questions by slightly varying the wording or using standard templates
    for (let i = 0; i < 80; i++) {
      const prompt = personalityPrompts[i % personalityPrompts.length];
      questionsToInsert.push({
        assessment_id: myersBriggs.assessment_id,
        question_text: `Q${i+1}: ${prompt} (Variation ${Math.floor(i/8) + 1})`,
        question_type: 'rating_scale',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
        correct_answer: null,
        points: 1,
        order_index: i + 1
      });
    }

    // --- 2. Tech & Logic Aptitude Challenge (Multiple Choice) - Generating 70 questions ---
    console.log('Generating Tech & Logic questions...');
    const logicQuestions = [
      { text: "If x = 10 and y = 5, what is x + y * 2?", options: ["20", "30", "15", "25"], answer: "20" },
      { text: "Which of the following is not a programming language?", options: ["Python", "Java", "HTML", "C++"], answer: "HTML" },
      { text: "What is the next number in the sequence: 2, 4, 8, 16, ...?", options: ["24", "32", "64", "20"], answer: "32" },
      { text: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?", options: ["$0.10", "$0.05", "$1.00", "$0.50"], answer: "$0.05" }
    ];

    for (let i = 0; i < 70; i++) {
      const q = logicQuestions[i % logicQuestions.length];
      questionsToInsert.push({
        assessment_id: techLogic.assessment_id,
        question_text: `Q${i+1}: ${q.text}`,
        question_type: 'multiple_choice',
        options: q.options,
        correct_answer: q.answer,
        points: 5,
        order_index: i + 1
      });
    }

    // --- 3. Healthcare Empathy & Anatomy Basics - Generating 70 questions ---
    console.log('Generating Healthcare questions...');
    const healthcareQuestions = [
      { text: "The femur is a bone located in the...", options: ["Arm", "Leg", "Spine", "Skull"], answer: "Leg", type: 'multiple_choice' },
      { text: "Empathy involves understanding and sharing the feelings of another.", options: ["True", "False"], answer: "True", type: 'true_false' },
      { text: "What is the normal resting heart rate for adults?", options: ["40-60 bpm", "60-100 bpm", "100-120 bpm", "120-140 bpm"], answer: "60-100 bpm", type: 'multiple_choice' },
      { text: "Patient confidentiality means you can discuss a patient's condition with your family members.", options: ["True", "False"], answer: "False", type: 'true_false' }
    ];

    for (let i = 0; i < 70; i++) {
      const q = healthcareQuestions[i % healthcareQuestions.length];
      questionsToInsert.push({
        assessment_id: healthcare.assessment_id,
        question_text: `Q${i+1}: ${q.text}`,
        question_type: q.type,
        options: q.options,
        correct_answer: q.answer,
        points: q.type === 'multiple_choice' ? 5 : 2,
        order_index: i + 1
      });
    }

    // Insert all questions
    console.log(`Inserting ${questionsToInsert.length} questions into the database...`);
    await Question.bulkCreate(questionsToInsert);

    console.log('Successfully seeded 220 sample questions!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }
}

seedQuestions();
