const { sequelize } = require('./config/database');
const { CareerPath, Skill, AssessmentType, Assessment } = require('./models');

const realWorldSkills = [
  { skill_name: 'JavaScript', category: 'Technical' },
  { skill_name: 'Python', category: 'Technical' },
  { skill_name: 'Data Analysis', category: 'Analytical' },
  { skill_name: 'UI/UX Design', category: 'Design' },
  { skill_name: 'Figma', category: 'Design' },
  { skill_name: 'Machine Learning', category: 'Technical' },
  { skill_name: 'Financial Modeling', category: 'Analytical' },
  { skill_name: 'Public Speaking', category: 'Soft Skill' },
  { skill_name: 'Project Management', category: 'Management' },
  { skill_name: 'Patient Care', category: 'Healthcare' },
  { skill_name: 'Anatomy', category: 'Healthcare' },
  { skill_name: 'SEO', category: 'Marketing' },
  { skill_name: 'Copywriting', category: 'Marketing' }
];

const realWorldCareers = [
  {
    title: 'Full Stack Software Engineer',
    description: 'Design, develop, and maintain both the front-end and back-end of web applications.',
    required_education: 'bachelor',
    required_skills: ['JavaScript', 'Python', 'Project Management'],
    salary_range_min: 80000,
    salary_range_max: 160000,
    job_market_outlook: 'Excellent',
    growth_rate: 22.0,
    work_environment: 'Remote or Office. Fast-paced, collaborative.',
    daily_tasks: 'Writing code, reviewing pull requests, attending standups, system architecture design.',
    career_progression: 'Junior Engineer -> Senior Engineer -> Tech Lead -> Engineering Manager',
    is_active: true
  },
  {
    title: 'Data Scientist',
    description: 'Analyze complex data sets to help companies make business decisions.',
    required_education: 'master',
    required_skills: ['Python', 'Data Analysis', 'Machine Learning'],
    salary_range_min: 95000,
    salary_range_max: 180000,
    job_market_outlook: 'Excellent',
    growth_rate: 35.0,
    work_environment: 'Office or Hybrid. Highly analytical, independent work.',
    daily_tasks: 'Cleaning data, building predictive models, creating visualizations.',
    career_progression: 'Data Analyst -> Data Scientist -> Senior Data Scientist -> Chief Data Officer',
    is_active: true
  },
  {
    title: 'Product Designer (UI/UX)',
    description: 'Create intuitive, user-friendly, and aesthetically pleasing digital products.',
    required_education: 'bachelor',
    required_skills: ['UI/UX Design', 'Figma', 'Project Management'],
    salary_range_min: 75000,
    salary_range_max: 145000,
    job_market_outlook: 'Good',
    growth_rate: 15.0,
    work_environment: 'Creative studio or remote. Highly collaborative.',
    daily_tasks: 'Wireframing, user testing, high-fidelity prototyping, design handoffs.',
    career_progression: 'Junior Designer -> Senior Designer -> UX Lead -> VP of Design',
    is_active: true
  },
  {
    title: 'Investment Banker',
    description: 'Help organizations raise capital and provide financial advisory services.',
    required_education: 'bachelor',
    required_skills: ['Financial Modeling', 'Data Analysis', 'Public Speaking'],
    salary_range_min: 100000,
    salary_range_max: 250000,
    job_market_outlook: 'Good',
    growth_rate: 10.0,
    work_environment: 'Corporate office. High pressure, long hours.',
    daily_tasks: 'Financial modeling, pitch deck creation, client meetings, market research.',
    career_progression: 'Analyst -> Associate -> VP -> Managing Director',
    is_active: true
  },
  {
    title: 'Registered Nurse',
    description: 'Provide and coordinate patient care, educate patients, and provide advice and emotional support.',
    required_education: 'bachelor',
    required_skills: ['Patient Care', 'Anatomy'],
    salary_range_min: 65000,
    salary_range_max: 110000,
    job_market_outlook: 'Excellent',
    growth_rate: 9.0,
    work_environment: 'Hospitals, clinics. Shift work, physically demanding.',
    daily_tasks: 'Administering medication, monitoring patient vitals, updating records.',
    career_progression: 'RN -> Charge Nurse -> Nurse Practitioner -> Director of Nursing',
    is_active: true
  },
  {
    title: 'Digital Marketing Manager',
    description: 'Develop and implement marketing campaigns to promote a company and its products.',
    required_education: 'bachelor',
    required_skills: ['SEO', 'Copywriting', 'Data Analysis'],
    salary_range_min: 60000,
    salary_range_max: 120000,
    job_market_outlook: 'Good',
    growth_rate: 10.0,
    work_environment: 'Office or remote. Creative and analytical.',
    daily_tasks: 'Managing ad spend, writing copy, analyzing campaign performance.',
    career_progression: 'Marketing Coordinator -> Marketing Manager -> Marketing Director -> CMO',
    is_active: true
  }
];

const realWorldAssessmentTypes = [
  { type_name: 'Personality Test', description: 'Evaluates your personality traits and work preferences.' },
  { type_name: 'Aptitude Test', description: 'Measures your logical, numerical, and verbal reasoning abilities.' },
  { type_name: 'Skill Assessment', description: 'Tests specific technical or hard skills.' }
];

async function seedDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB...');

    // Sync database (doesn't drop tables, just ensures they exist)
    await sequelize.sync();

    // 1. Seed Skills
    console.log('Seeding Skills...');
    for (const skill of realWorldSkills) {
      await Skill.findOrCreate({
        where: { skill_name: skill.skill_name },
        defaults: skill
      });
    }

    // 2. Seed Career Paths
    console.log('Seeding Career Paths...');
    for (const career of realWorldCareers) {
      await CareerPath.findOrCreate({
        where: { title: career.title },
        defaults: career
      });
    }

    // 3. Seed Assessment Types
    console.log('Seeding Assessment Types...');
    const types = [];
    for (const type of realWorldAssessmentTypes) {
      const [t] = await AssessmentType.findOrCreate({
        where: { type_name: type.type_name },
        defaults: type
      });
      types.push(t);
    }

    // 4. Seed Assessments
    console.log('Seeding Assessments...');
    const assessments = [
      {
        type_id: types[0].type_id,
        title: 'Myers-Briggs Career Indicator',
        description: 'Discover careers that match your core personality type.',
        duration_minutes: 15,
        total_questions: 50,
        is_active: true
      },
      {
        type_id: types[1].type_id,
        title: 'Tech & Logic Aptitude Challenge',
        description: 'Test your logical reasoning and problem-solving skills.',
        duration_minutes: 30,
        total_questions: 20,
        is_active: true
      },
      {
        type_id: types[2].type_id,
        title: 'Healthcare Empathy & Anatomy Basics',
        description: 'Assess your knowledge of anatomy and patient care scenarios.',
        duration_minutes: 25,
        total_questions: 30,
        is_active: true
      }
    ];

    for (const assessment of assessments) {
      await Assessment.findOrCreate({
        where: { title: assessment.title },
        defaults: assessment
      });
    }

    console.log('Database seeded successfully with real-world career data!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
