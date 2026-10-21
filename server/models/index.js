const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

// User model
const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('student', 'counsellor', 'admin'),
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true
});

// Student model
const Student = sequelize.define('Student', {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  date_of_birth: {
    type: DataTypes.DATEONLY
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  address: {
    type: DataTypes.TEXT
  },
  current_education_level: {
    type: DataTypes.STRING(50)
  },
  interests: {
    type: DataTypes.TEXT
  },
  goals: {
    type: DataTypes.TEXT
  },
  profile_picture: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'students',
  timestamps: true
});

// Counsellor model
const Counsellor = sequelize.define('Counsellor', {
  counsellor_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  specialization: {
    type: DataTypes.STRING(100)
  },
  experience_years: {
    type: DataTypes.INTEGER
  },
  qualifications: {
    type: DataTypes.TEXT
  },
  bio: {
    type: DataTypes.TEXT
  },
  hourly_rate: {
    type: DataTypes.DECIMAL(10, 2)
  },
  availability_schedule: {
    type: DataTypes.JSON
  },
  profile_picture: {
    type: DataTypes.STRING(255)
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'counsellors',
  timestamps: true
});

// Skill model
const Skill = sequelize.define('Skill', {
  skill_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  skill_name: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(50)
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'skills',
  timestamps: true
});

// Assessment Type model
const AssessmentType = sequelize.define('AssessmentType', {
  type_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  total_questions: {
    type: DataTypes.INTEGER
  },
  duration_minutes: {
    type: DataTypes.INTEGER
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'assessment_types',
  timestamps: true
});

// Assessment model
const Assessment = sequelize.define('Assessment', {
  assessment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'assessment_types',
      key: 'type_id'
    }
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  instructions: {
    type: DataTypes.TEXT
  },
  total_score: {
    type: DataTypes.INTEGER
  },
  passing_score: {
    type: DataTypes.INTEGER
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'assessments',
  timestamps: true
});

// Question model
const Question = sequelize.define('Question', {
  question_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  assessment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'assessments',
      key: 'assessment_id'
    }
  },
  question_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  question_type: {
    type: DataTypes.ENUM('multiple_choice', 'true_false', 'rating_scale', 'text'),
    allowNull: false
  },
  options: {
    type: DataTypes.JSON
  },
  correct_answer: {
    type: DataTypes.STRING(500)
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  order_index: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'questions',
  timestamps: true
});

// Career Path model
const CareerPath = sequelize.define('CareerPath', {
  career_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  required_education: {
    type: DataTypes.STRING(100)
  },
  required_skills: {
    type: DataTypes.JSON
  },
  salary_range_min: {
    type: DataTypes.DECIMAL(10, 2)
  },
  salary_range_max: {
    type: DataTypes.DECIMAL(10, 2)
  },
  job_market_outlook: {
    type: DataTypes.STRING(50)
  },
  growth_rate: {
    type: DataTypes.DECIMAL(5, 2)
  },
  work_environment: {
    type: DataTypes.TEXT
  },
  daily_tasks: {
    type: DataTypes.TEXT
  },
  career_progression: {
    type: DataTypes.TEXT
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'career_paths',
  timestamps: true
});

// Session model
const Session = sequelize.define('Session', {
  session_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'student_id'
    }
  },
  counsellor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'counsellors',
      key: 'counsellor_id'
    }
  },
  session_type: {
    type: DataTypes.ENUM('one_on_one', 'group', 'assessment_review'),
    allowNull: false
  },
  session_mode: {
    type: DataTypes.ENUM('online', 'offline'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(200)
  },
  description: {
    type: DataTypes.TEXT
  },
  scheduled_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled'),
    defaultValue: 'scheduled'
  },
  meeting_link: {
    type: DataTypes.STRING(500)
  },
  location: {
    type: DataTypes.STRING(200)
  },
  notes: {
    type: DataTypes.TEXT
  },
  feedback: {
    type: DataTypes.TEXT
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    }
  }
}, {
  tableName: 'sessions',
  timestamps: true
});

// Student Assessment model
const StudentAssessment = sequelize.define('StudentAssessment', {
  attempt_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'student_id'
    }
  },
  assessment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'assessments',
      key: 'assessment_id'
    }
  },
  started_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  completed_at: {
    type: DataTypes.DATE
  },
  total_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  percentage: {
    type: DataTypes.DECIMAL(5, 2)
  },
  status: {
    type: DataTypes.ENUM('in_progress', 'completed', 'abandoned'),
    defaultValue: 'in_progress'
  },
  time_taken_minutes: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'student_assessments',
  timestamps: true
});

// Student Answer model
const StudentAnswer = sequelize.define('StudentAnswer', {
  answer_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  attempt_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'student_assessments',
      key: 'attempt_id'
    }
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'questions',
      key: 'question_id'
    }
  },
  answer_text: {
    type: DataTypes.TEXT
  },
  is_correct: {
    type: DataTypes.BOOLEAN
  },
  points_earned: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  answered_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'student_answers',
  timestamps: false
});

// Student Skill model
const StudentSkill = sequelize.define('StudentSkill', {
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'students',
      key: 'student_id'
    }
  },
  skill_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'skills',
      key: 'skill_id'
    }
  },
  proficiency_level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'expert'),
    defaultValue: 'beginner'
  },
  years_of_experience: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'student_skills',
  timestamps: true,
  primaryKey: false
});

// Career Recommendation model
const CareerRecommendation = sequelize.define('CareerRecommendation', {
  recommendation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'student_id'
    }
  },
  career_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'career_paths',
      key: 'career_id'
    }
  },
  counsellor_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'counsellors',
      key: 'counsellor_id'
    }
  },
  match_score: {
    type: DataTypes.DECIMAL(5, 2)
  },
  reasoning: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'career_recommendations',
  timestamps: true
});

// Message model
const Message = sequelize.define('Message', {
  message_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  session_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'sessions',
      key: 'session_id'
    }
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  message_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  message_type: {
    type: DataTypes.ENUM('text', 'image', 'file', 'system'),
    defaultValue: 'text'
  },
  file_url: {
    type: DataTypes.STRING(500)
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sent_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'messages',
  timestamps: false
});

// Notification model
const Notification = sequelize.define('Notification', {
  notification_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('session_reminder', 'assessment_due', 'career_recommendation', 'system', 'message'),
    allowNull: false
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  action_url: {
    type: DataTypes.STRING(500)
  }
}, {
  tableName: 'notifications',
  timestamps: true
});

// Define associations
User.hasOne(Student, { foreignKey: 'user_id' });
Student.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Counsellor, { foreignKey: 'user_id' });
Counsellor.belongsTo(User, { foreignKey: 'user_id' });

AssessmentType.hasMany(Assessment, { foreignKey: 'type_id' });
Assessment.belongsTo(AssessmentType, { foreignKey: 'type_id' });

Assessment.hasMany(Question, { foreignKey: 'assessment_id' });
Question.belongsTo(Assessment, { foreignKey: 'assessment_id' });

Student.belongsToMany(Skill, { through: StudentSkill, foreignKey: 'student_id' });
Skill.belongsToMany(Student, { through: StudentSkill, foreignKey: 'skill_id' });

StudentSkill.belongsTo(Skill, { foreignKey: 'skill_id' });
Skill.hasMany(StudentSkill, { foreignKey: 'skill_id' });

StudentSkill.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(StudentSkill, { foreignKey: 'student_id' });


Student.hasMany(StudentAssessment, { foreignKey: 'student_id' });
StudentAssessment.belongsTo(Student, { foreignKey: 'student_id' });

Assessment.hasMany(StudentAssessment, { foreignKey: 'assessment_id' });
StudentAssessment.belongsTo(Assessment, { foreignKey: 'assessment_id' });

StudentAssessment.hasMany(StudentAnswer, { foreignKey: 'attempt_id' });
StudentAnswer.belongsTo(StudentAssessment, { foreignKey: 'attempt_id' });

Question.hasMany(StudentAnswer, { foreignKey: 'question_id' });
StudentAnswer.belongsTo(Question, { foreignKey: 'question_id' });

Student.hasMany(Session, { foreignKey: 'student_id' });
Session.belongsTo(Student, { foreignKey: 'student_id' });

Counsellor.hasMany(Session, { foreignKey: 'counsellor_id' });
Session.belongsTo(Counsellor, { foreignKey: 'counsellor_id' });

Session.hasMany(Message, { foreignKey: 'session_id' });
Message.belongsTo(Session, { foreignKey: 'session_id' });

User.hasMany(Message, { foreignKey: 'sender_id', as: 'SentMessages' });
User.hasMany(Message, { foreignKey: 'receiver_id', as: 'ReceivedMessages' });

User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

Student.hasMany(CareerRecommendation, { foreignKey: 'student_id' });
CareerRecommendation.belongsTo(Student, { foreignKey: 'student_id' });

CareerPath.hasMany(CareerRecommendation, { foreignKey: 'career_id' });
CareerRecommendation.belongsTo(CareerPath, { foreignKey: 'career_id' });

Counsellor.hasMany(CareerRecommendation, { foreignKey: 'counsellor_id' });
CareerRecommendation.belongsTo(Counsellor, { foreignKey: 'counsellor_id' });

module.exports = {
  User,
  Student,
  Counsellor,
  Skill,
  AssessmentType,
  Assessment,
  Question,
  CareerPath,
  Session,
  StudentAssessment,
  StudentAnswer,
  StudentSkill,
  CareerRecommendation,
  Message,
  Notification
};
