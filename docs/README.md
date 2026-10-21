# NeoPath Career Counselling and Guidance System

A comprehensive web application for career counselling and guidance, designed to help students discover their career paths through assessments, AI-powered recommendations, and one-on-one counselling sessions.

## 🚀 Features

### User Roles

#### Student
- **Registration & Profile Management**: Create and update personal profiles with skills, interests, and goals
- **Assessment Module**: Take aptitude, personality, and skill assessments with automatic scoring
- **Career Discovery**: Receive AI-powered career recommendations based on assessment results
- **Session Management**: Schedule and attend one-on-one counselling sessions
- **Real-time Communication**: Chat and video calls with counsellors
- **Progress Tracking**: Monitor assessment scores and career recommendations

#### Counsellor
- **Profile Management**: Create detailed professional profiles with specializations
- **Session Management**: Conduct one-on-one and group counselling sessions
- **Student Management**: View and manage assigned students
- **Assessment Tools**: Create and manage assessment questions
- **Career Guidance**: Provide personalized career recommendations
- **Analytics**: Track session statistics and student progress

#### Admin
- **User Management**: Manage students, counsellors, and system users
- **System Analytics**: View comprehensive system statistics and reports
- **Content Management**: Manage career paths, assessments, and system settings
- **Session Oversight**: Monitor all counselling sessions and activities

### Core Functionalities

#### Assessment System
- **Multiple Assessment Types**: Aptitude, personality, skill, and interest assessments
- **Automatic Scoring**: Real-time calculation of scores and percentages
- **Progress Tracking**: Historical assessment data and performance trends
- **Adaptive Questions**: Dynamic question selection based on responses

#### Career Recommendation Engine
- **AI-Powered Matching**: Advanced algorithm considering skills, assessments, and preferences
- **Multi-factor Analysis**: Considers education, experience, interests, and market trends
- **Personalized Suggestions**: Tailored career paths with detailed explanations
- **Counsellor Integration**: Manual recommendations from qualified counsellors

#### Communication System
- **Real-time Chat**: Instant messaging between students and counsellors
- **Video Conferencing**: Integrated video calls for remote sessions
- **File Sharing**: Share documents, images, and resources
- **Notification System**: Email and in-app notifications for important events

#### Session Management
- **Flexible Scheduling**: Online and offline session options
- **Calendar Integration**: Easy scheduling with availability management
- **Session Types**: One-on-one, group, and assessment review sessions
- **Progress Tracking**: Session notes, feedback, and rating system

## 🏗️ System Architecture

### Frontend
- **Framework**: React.js 18 with functional components and hooks
- **State Management**: React Query for server state, Context API for global state
- **UI Library**: Tailwind CSS with custom components
- **Routing**: React Router v6 for client-side routing
- **Real-time**: Socket.io for live communication
- **Forms**: React Hook Form with validation

### Backend
- **Runtime**: Node.js with Express.js framework
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT-based authentication with role-based access control
- **Real-time**: Socket.io for WebSocket communication
- **Validation**: Express-validator for request validation
- **Security**: Helmet.js, CORS, rate limiting

### Database Design
- **Primary Database**: MySQL with comprehensive ER model
- **Relationships**: Well-defined foreign key relationships
- **Indexing**: Optimized queries with proper indexing
- **Data Integrity**: Constraints and validation at database level

## 📊 Database Schema

### Key Entities
- **Users**: Base table for all user types (students, counsellors, admins)
- **Students**: Student-specific information and profile data
- **Counsellors**: Counsellor profiles with specializations and availability
- **Assessments**: Assessment definitions and questions
- **Career Paths**: Career information with requirements and market data
- **Sessions**: Counselling session management
- **Messages**: Real-time communication storage

### Relationships
- **One-to-One**: Users ↔ Students, Users ↔ Counsellors
- **One-to-Many**: Assessments → Questions, Students → Sessions
- **Many-to-Many**: Students ↔ Skills, Students ↔ Career Paths

## 🔧 Technical Specifications

### Software Requirements
- **Operating System**: Windows 10/11, Linux (Ubuntu 18.04+), macOS
- **Node.js**: Version 16.0 or higher
- **MySQL**: Version 8.0 or higher
- **Development Tools**: VS Code, Git, MySQL Workbench

### Hardware Requirements
- **Processor**: Intel i3 or equivalent
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 250GB available space
- **Network**: Stable internet connection for real-time features

### Deployment
- **Cloud Platforms**: AWS, Azure, Heroku
- **Containerization**: Docker support
- **Environment**: Production-ready configuration
- **Monitoring**: Built-in health checks and logging

## 📈 Key Features

### AI-Powered Recommendations
- **Multi-factor Analysis**: Considers assessment scores, skills, interests, and market data
- **Weighted Scoring**: Different weights for various factors
- **Continuous Learning**: System improves with more data
- **Transparency**: Clear explanation of recommendation reasoning

### Real-time Communication
- **WebSocket Integration**: Instant messaging and notifications
- **Video Conferencing**: Built-in video call functionality
- **File Sharing**: Secure file upload and sharing
- **Typing Indicators**: Real-time typing status

### Assessment System
- **Multiple Question Types**: Multiple choice, true/false, rating scale, text
- **Adaptive Scoring**: Dynamic scoring based on question difficulty
- **Time Management**: Configurable time limits and tracking
- **Progress Saving**: Resume assessments from where you left off

### Analytics and Reporting
- **Student Progress**: Track assessment scores and career development
- **Counsellor Performance**: Session statistics and student feedback
- **System Analytics**: User engagement and feature usage
- **Custom Reports**: Generate detailed reports for stakeholders

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MySQL (v8.0+)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd neopath-career-counselling
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp server/env.example server/.env
   # Edit server/.env with your configuration
   ```

4. **Set up the database**
   ```bash
   # Create MySQL database
   mysql -u root -p < database/schema.sql
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Default Accounts
- **Admin**: admin@neopath.com / admin123
- **Counsellor**: counsellor@neopath.com / counsellor123
- **Student**: student@neopath.com / student123

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/password` - Update password

### Student Endpoints
- `GET /api/students/profile` - Get student profile
- `PUT /api/students/profile` - Update student profile
- `GET /api/students/skills` - Get student skills
- `POST /api/students/skills` - Add skill to student

### Assessment Endpoints
- `GET /api/assessments/types` - Get assessment types
- `GET /api/assessments/:id` - Get specific assessment
- `POST /api/assessments/:id/start` - Start assessment
- `POST /api/assessments/attempts/:id/complete` - Complete assessment

### Career Endpoints
- `GET /api/careers/paths` - Get career paths
- `GET /api/careers/recommendations/student` - Get student recommendations
- `POST /api/careers/recommendations/generate` - Generate AI recommendations

### Session Endpoints
- `GET /api/sessions/my-sessions` - Get user sessions
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `GET /api/sessions/availability/:counsellorId` - Get counsellor availability

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Granular permissions for different user types
- **Input Validation**: Comprehensive validation on both client and server
- **SQL Injection Prevention**: Parameterized queries with Sequelize
- **XSS Protection**: Content Security Policy and input sanitization
- **Rate Limiting**: API rate limiting to prevent abuse
- **HTTPS Support**: SSL/TLS encryption for production

## 📱 User Interface

### Design Principles
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: WCAG 2.1 compliant interface
- **Modern UI**: Clean, intuitive design with Tailwind CSS
- **Dark Mode**: Optional dark theme support
- **Progressive Web App**: PWA capabilities for mobile users

### Key Components
- **Dashboard**: Role-specific dashboards with key metrics
- **Assessment Interface**: Interactive assessment taking experience
- **Chat Interface**: Real-time messaging with counsellors
- **Calendar**: Session scheduling and management
- **Profile Management**: Comprehensive profile editing

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Component and function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user journey testing
- **Performance Tests**: Load and stress testing

### Running Tests
```bash
# Frontend tests
cd client && npm test

# Backend tests
cd server && npm test

# E2E tests
npm run test:e2e
```

## 📊 Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Compressed and responsive images
- **Caching**: React Query for intelligent caching
- **Bundle Optimization**: Webpack optimization and tree shaking

### Backend Optimizations
- **Database Indexing**: Optimized database queries
- **Connection Pooling**: Efficient database connections
- **Caching**: Redis for session and data caching
- **Compression**: Gzip compression for API responses

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client && npm run build

# Start production server
cd server && npm start
```

### Docker Deployment
```bash
# Build Docker images
docker-compose build

# Start services
docker-compose up -d
```

### Environment Variables
- `NODE_ENV`: Production/development environment
- `DB_HOST`: Database host
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: JWT signing secret
- `CLIENT_URL`: Frontend URL for CORS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@neopath.com
- Documentation: [docs.neopath.com](https://docs.neopath.com)
- Issues: GitHub Issues

## 🔮 Future Enhancements

- **Mobile App**: Native iOS and Android applications
- **Advanced Analytics**: Machine learning for better recommendations
- **Integration APIs**: Third-party integrations (LinkedIn, job boards)
- **Multi-language Support**: Internationalization
- **Advanced Video Features**: Screen sharing, recording
- **AI Chatbot**: Automated initial guidance and FAQ

---

**NeoPath** - Reinventing the Career Journey 🚀
