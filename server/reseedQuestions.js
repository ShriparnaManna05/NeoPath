const { sequelize } = require('./config/database');
const { Assessment, Question } = require('./models');

async function reseedQuestions() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB...');

    console.log('Deleting old answers and questions...');
    const { StudentAnswer, StudentAssessment } = require('./models');
    await StudentAnswer.destroy({ where: {} });
    await StudentAssessment.destroy({ where: {} });
    await Question.destroy({ where: {} });

    const myersBriggs = await Assessment.findOne({ where: { title: 'Myers-Briggs Career Indicator' } });
    const techLogic = await Assessment.findOne({ where: { title: 'Tech & Logic Aptitude Challenge' } });
    const healthcare = await Assessment.findOne({ where: { title: 'Healthcare Empathy & Anatomy Basics' } });

    const questionsToInsert = [];

    // --- 1. Myers-Briggs Questions (Rating Scale) - 8 unique questions ---
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
    
    personalityPrompts.forEach((prompt, i) => {
      questionsToInsert.push({
        assessment_id: myersBriggs.assessment_id,
        question_text: `Q${i+1}: ${prompt}`,
        question_type: 'rating_scale',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
        correct_answer: null,
        points: 1,
        order_index: i + 1
      });
    });

    // --- 2. Tech & Logic Aptitude Challenge (Multiple Choice) - 8 unique questions ---
    const logicQuestions = [
      { text: "If x = 10 and y = 5, what is x + y * 2?", options: ["20", "30", "15", "25"], answer: "20" },
      { text: "Which of the following is not a programming language?", options: ["Python", "Java", "HTML", "C++"], answer: "HTML" },
      { text: "What is the next number in the sequence: 2, 4, 8, 16, ...?", options: ["24", "32", "64", "20"], answer: "32" },
      { text: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?", options: ["$0.10", "$0.05", "$1.00", "$0.50"], answer: "$0.05" },
      { text: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?", options: ["Yes", "No", "Cannot be determined"], answer: "Yes" },
      { text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Question Language", "Structured Question Language", "None of the above"], answer: "Structured Query Language" },
      { text: "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?", options: ["100 minutes", "50 minutes", "5 minutes", "10 minutes"], answer: "5 minutes" },
      { text: "Which data structure uses LIFO (Last In First Out)?", options: ["Queue", "Stack", "Tree", "Graph"], answer: "Stack" }
    ];

    logicQuestions.forEach((q, i) => {
      questionsToInsert.push({
        assessment_id: techLogic.assessment_id,
        question_text: `Q${i+1}: ${q.text}`,
        question_type: 'multiple_choice',
        options: q.options,
        correct_answer: q.answer,
        points: 5,
        order_index: i + 1
      });
    });

    // --- 3. Healthcare Empathy & Anatomy Basics - 8 unique questions ---
    const healthcareQuestions = [
      { text: "The femur is a bone located in the...", options: ["Arm", "Leg", "Spine", "Skull"], answer: "Leg", type: 'multiple_choice' },
      { text: "Empathy involves understanding and sharing the feelings of another.", options: ["True", "False"], answer: "True", type: 'true_false' },
      { text: "What is the normal resting heart rate for adults?", options: ["40-60 bpm", "60-100 bpm", "100-120 bpm", "120-140 bpm"], answer: "60-100 bpm", type: 'multiple_choice' },
      { text: "Patient confidentiality means you can discuss a patient's condition with your family members.", options: ["True", "False"], answer: "False", type: 'true_false' },
      { text: "Which organ is primarily responsible for filtering blood?", options: ["Heart", "Liver", "Kidneys", "Lungs"], answer: "Kidneys", type: 'multiple_choice' },
      { text: "A patient is visibly upset about a diagnosis. You should immediately tell them everything will be fine to cheer them up.", options: ["True", "False"], answer: "False", type: 'true_false' },
      { text: "What is the largest organ in the human body?", options: ["Liver", "Brain", "Skin", "Heart"], answer: "Skin", type: 'multiple_choice' },
      { text: "A pulse oximeter measures what in the blood?", options: ["Sugar levels", "Oxygen saturation", "White blood cells", "Iron levels"], answer: "Oxygen saturation", type: 'multiple_choice' }
    ];

    healthcareQuestions.forEach((q, i) => {
      questionsToInsert.push({
        assessment_id: healthcare.assessment_id,
        question_text: `Q${i+1}: ${q.text}`,
        question_type: q.type,
        options: q.options,
        correct_answer: q.answer,
        points: q.type === 'multiple_choice' ? 5 : 2,
        order_index: i + 1
      });
    });

    // Insert all questions
    console.log(`Inserting ${questionsToInsert.length} unique questions into the database...`);
    await Question.bulkCreate(questionsToInsert);

    // Update the total questions count on the Assessment Types
    const { AssessmentType } = require('./models');
    await AssessmentType.update({ total_questions: 8 }, { where: {} });

    console.log('Successfully re-seeded with entirely UNIQUE questions!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }
}

reseedQuestions();
