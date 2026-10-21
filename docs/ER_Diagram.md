# Entity Relationship Diagram - NeoPath Career Counselling System

## Entities and Relationships

### Strong Entities:
1. **Users** (user_id, email, password_hash, role, is_active, created_at, updated_at)
2. **Skills** (skill_id, skill_name, category, description, created_at)
3. **Assessment_Types** (type_id, type_name, description, total_questions, duration_minutes, is_active, created_at)
4. **Assessments** (assessment_id, type_id, title, description, instructions, total_score, passing_score, is_active, created_at, updated_at)
5. **Questions** (question_id, assessment_id, question_text, question_type, options, correct_answer, points, order_index, created_at)
6. **Career_Paths** (career_id, title, description, required_education, required_skills, salary_range_min, salary_range_max, job_market_outlook, growth_rate, work_environment, daily_tasks, career_progression, is_active, created_at, updated_at)
7. **Sessions** (session_id, student_id, counsellor_id, session_type, session_mode, title, description, scheduled_at, duration_minutes, status, meeting_link, location, notes, feedback, rating, created_at, updated_at)
8. **Messages** (message_id, session_id, sender_id, receiver_id, message_text, message_type, file_url, is_read, sent_at)
9. **Notifications** (notification_id, user_id, title, message, type, is_read, action_url, created_at)
10. **System_Settings** (setting_id, setting_key, setting_value, description, updated_at)

### Weak Entities:
1. **Students** (student_id, user_id, first_name, last_name, date_of_birth, phone, address, current_education_level, interests, goals, profile_picture, created_at, updated_at)
2. **Counsellors** (counsellor_id, user_id, first_name, last_name, specialization, experience_years, qualifications, bio, hourly_rate, availability_schedule, profile_picture, is_verified, created_at, updated_at)

### Associative Entities:
1. **Student_Skills** (student_id, skill_id, proficiency_level, years_of_experience, created_at)
2. **Student_Assessments** (attempt_id, student_id, assessment_id, started_at, completed_at, total_score, percentage, status, time_taken_minutes, created_at)
3. **Student_Answers** (answer_id, attempt_id, question_id, answer_text, is_correct, points_earned, answered_at)
4. **Career_Recommendations** (recommendation_id, student_id, career_id, counsellor_id, match_score, reasoning, status, created_at, updated_at)

## Relationships:

### One-to-One Relationships:
- Users → Students (1:1, total participation on Students side)
- Users → Counsellors (1:1, total participation on Counsellors side)

### One-to-Many Relationships:
- Assessment_Types → Assessments (1:N)
- Assessments → Questions (1:N)
- Students → Student_Assessments (1:N)
- Students → Career_Recommendations (1:N)
- Counsellors → Career_Recommendations (1:N)
- Counsellors → Sessions (1:N)
- Students → Sessions (1:N)
- Sessions → Messages (1:N)
- Users → Notifications (1:N)

### Many-to-Many Relationships:
- Students ↔ Skills (M:N, through Student_Skills)
- Students ↔ Assessments (M:N, through Student_Assessments)
- Students ↔ Career_Paths (M:N, through Career_Recommendations)

### Unary Relationships:
- Users → Users (self-referencing for mentor-mentee relationships)

## Participation Constraints:
- **Total Participation**: Students and Counsellors must be associated with a User
- **Partial Participation**: Skills can exist without being associated with students

## Key Constraints:
- Primary Keys: All entities have unique primary keys
- Foreign Keys: Proper referential integrity maintained
- Check Constraints: Rating values (1-5), status enums
- Unique Constraints: Email addresses, skill names
