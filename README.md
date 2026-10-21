# NeoPath Career Counselling and Guidance System

A comprehensive web application for career counselling and guidance, designed to help students discover their career paths through assessments, AI-powered recommendations, and one-on-one counselling sessions.

![NeoPath Logo](docs/logo.png)

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

## 📊 Database Schema

The system uses a comprehensive MySQL database with the following key entities:

- **Users**: Base table for all user types (students, counsellors, admins)
- **Students**: Student-specific information and profile data
- **Counsellors**: Counsellor profiles with specializations and availability
- **Assessments**: Assessment definitions and questions
- **Career Paths**: Career information with requirements and market data
- **Sessions**: Counselling session management
- **Messages**: Real-time communication storage

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

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
cd client && npm test

# Backend tests
cd server && npm test

# E2E tests
npm run test:e2e
```

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

## 📊 System Diagrams

The project includes comprehensive system diagrams:

- **ER Diagram**: Database entity relationships
- **Context Flow Diagram**: System interactions
- **DFD Level 0 & Level 1**: Data flow diagrams
- **State Transition Diagram**: Assessment flow
- **Use Case Diagram**: One-to-one interactions
- **System Architecture**: Component relationships

See `docs/System_Diagrams.md` for detailed diagrams.

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

## Quick Start Commands

```bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Project Structure

```
neopath-career-counselling/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── ...
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   ├── models/           # Database models
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   └── package.json
├── database/             # Database schema
│   └── schema.sql
├── docs/                # Documentation
│   ├── README.md
│   ├── ER_Diagram.md
│   └── System_Diagrams.md
└── package.json         # Root package.json
```
