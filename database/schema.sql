-- NeoPath Career Counselling System Database Schema
-- MySQL Database Schema

CREATE DATABASE IF NOT EXISTS neopath_career_counselling;
USE neopath_career_counselling;

-- Users table (base table for all user types)
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'counsellor', 'admin') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Students table (weak entity - depends on users)
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    phone VARCHAR(20),
    address TEXT,
    current_education_level VARCHAR(50),
    interests TEXT,
    goals TEXT,
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Counsellors table (weak entity - depends on users)
CREATE TABLE counsellors (
    counsellor_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    experience_years INT,
    qualifications TEXT,
    bio TEXT,
    hourly_rate DECIMAL(10,2),
    availability_schedule JSON,
    profile_picture VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Skills table
CREATE TABLE skills (
    skill_id INT PRIMARY KEY AUTO_INCREMENT,
    skill_name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student skills (many-to-many relationship)
CREATE TABLE student_skills (
    student_id INT,
    skill_id INT,
    proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner',
    years_of_experience INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, skill_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

-- Assessment types
CREATE TABLE assessment_types (
    type_id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(100) NOT NULL,
    description TEXT,
    total_questions INT,
    duration_minutes INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessments table
CREATE TABLE assessments (
    assessment_id INT PRIMARY KEY AUTO_INCREMENT,
    type_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructions TEXT,
    total_score INT,
    passing_score INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES assessment_types(type_id)
);

-- Questions table
CREATE TABLE questions (
    question_id INT PRIMARY KEY AUTO_INCREMENT,
    assessment_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false', 'rating_scale', 'text') NOT NULL,
    options JSON,
    correct_answer VARCHAR(500),
    points INT DEFAULT 1,
    order_index INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE
);

-- Student assessment attempts
CREATE TABLE student_assessments (
    attempt_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    assessment_id INT NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    total_score INT DEFAULT 0,
    percentage DECIMAL(5,2),
    status ENUM('in_progress', 'completed', 'abandoned') DEFAULT 'in_progress',
    time_taken_minutes INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE
);

-- Student answers
CREATE TABLE student_answers (
    answer_id INT PRIMARY KEY AUTO_INCREMENT,
    attempt_id INT NOT NULL,
    question_id INT NOT NULL,
    answer_text TEXT,
    is_correct BOOLEAN,
    points_earned INT DEFAULT 0,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attempt_id) REFERENCES student_assessments(attempt_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

-- Career paths table
CREATE TABLE career_paths (
    career_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    required_education VARCHAR(100),
    required_skills JSON,
    salary_range_min DECIMAL(10,2),
    salary_range_max DECIMAL(10,2),
    job_market_outlook VARCHAR(50),
    growth_rate DECIMAL(5,2),
    work_environment TEXT,
    daily_tasks TEXT,
    career_progression TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Career recommendations
CREATE TABLE career_recommendations (
    recommendation_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    career_id INT NOT NULL,
    counsellor_id INT,
    match_score DECIMAL(5,2),
    reasoning TEXT,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (career_id) REFERENCES career_paths(career_id) ON DELETE CASCADE,
    FOREIGN KEY (counsellor_id) REFERENCES counsellors(counsellor_id) ON DELETE SET NULL
);

-- Sessions table
CREATE TABLE sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    counsellor_id INT NOT NULL,
    session_type ENUM('one_on_one', 'group', 'assessment_review') NOT NULL,
    session_mode ENUM('online', 'offline') NOT NULL,
    title VARCHAR(200),
    description TEXT,
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INT DEFAULT 60,
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled') DEFAULT 'scheduled',
    meeting_link VARCHAR(500),
    location VARCHAR(200),
    notes TEXT,
    feedback TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (counsellor_id) REFERENCES counsellors(counsellor_id) ON DELETE CASCADE
);

-- Messages table (for chat functionality)
CREATE TABLE messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message_text TEXT NOT NULL,
    message_type ENUM('text', 'image', 'file', 'system') DEFAULT 'text',
    file_url VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('session_reminder', 'assessment_due', 'career_recommendation', 'system', 'message') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- System settings table
CREATE TABLE system_settings (
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default data
INSERT INTO assessment_types (type_name, description, total_questions, duration_minutes) VALUES
('Aptitude Test', 'Tests logical reasoning, mathematical ability, and problem-solving skills', 50, 60),
('Personality Test', 'Assesses personality traits using Big Five model', 60, 45),
('Skill Assessment', 'Evaluates technical and soft skills', 40, 30),
('Interest Assessment', 'Measures career interests and preferences', 30, 25);

INSERT INTO skills (skill_name, category) VALUES
('Communication', 'Soft Skills'),
('Leadership', 'Soft Skills'),
('Problem Solving', 'Soft Skills'),
('Teamwork', 'Soft Skills'),
('Time Management', 'Soft Skills'),
('JavaScript', 'Technical'),
('Python', 'Technical'),
('React', 'Technical'),
('Node.js', 'Technical'),
('SQL', 'Technical'),
('Project Management', 'Professional'),
('Data Analysis', 'Professional'),
('Marketing', 'Professional'),
('Sales', 'Professional');

INSERT INTO career_paths (title, description, required_education, required_skills, salary_range_min, salary_range_max, job_market_outlook) VALUES
('Software Developer', 'Design and develop software applications', 'Bachelor\'s in Computer Science', '["JavaScript", "Python", "Problem Solving"]', 60000, 120000, 'Excellent'),
('Data Scientist', 'Analyze complex data to help organizations make decisions', 'Master\'s in Data Science', '["Python", "SQL", "Data Analysis"]', 70000, 150000, 'Excellent'),
('Marketing Manager', 'Plan and execute marketing strategies', 'Bachelor\'s in Marketing', '["Marketing", "Communication", "Leadership"]', 50000, 100000, 'Good'),
('Project Manager', 'Oversee projects from conception to completion', 'Bachelor\'s degree', '["Project Management", "Leadership", "Communication"]', 55000, 110000, 'Good');

INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('session_reminder_hours', '24', 'Hours before session to send reminder'),
('max_session_duration', '120', 'Maximum session duration in minutes'),
('assessment_timeout', '30', 'Assessment timeout in minutes'),
('email_notifications', 'true', 'Enable email notifications');
