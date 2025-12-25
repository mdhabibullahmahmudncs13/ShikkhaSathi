# ShikkhaSathi - AI-Powered Learning Platform for Bangladesh

**100% Local AI - Zero External API Dependencies**

ShikkhaSathi is an AI-powered adaptive learning platform specifically designed for Bangladesh students (Grades 6-12). The platform provides personalized education experiences with complete privacy, zero API costs, and full offline functionality.

## ✨ Key Features

- **Local AI Implementation**: Fully local AI stack with Ollama (llama3.2:1b) - no external API dependencies
- **Voice Integration**: Complete speech-to-text (Whisper) and text-to-speech (Coqui TTS) in Bengali and English
- **Multi-Stakeholder System**: Comprehensive dashboards for students, teachers, and parents
- **Gamified Learning**: XP system, achievements, streaks, and leaderboards
- **Adaptive Assessments**: Dynamic quizzes with RAG-powered contextual content
- **Offline-First Design**: Progressive Web App (PWA) with complete offline capabilities
- **Cultural Relevance**: Designed specifically for Bangladesh NCTB curriculum

## 🚀 Quick Start

### Prerequisites
- **Python 3.9+** with pip
- **Node.js 16+** with npm
- **Docker & Docker Compose** (for databases)
- **8GB RAM minimum** (16GB recommended)

### One-Command Setup

```bash
# Clone and start the application
git clone https://github.com/mdhabibullahmahmudncs13/ShikkhaSathi.git
cd ShikkhaSathi
./start-dev.sh
```

This will automatically:
- Start PostgreSQL, MongoDB, and Redis via Docker
- Set up Python virtual environment and dependencies
- Download and configure local AI models
- Start backend (port 8000) and frontend (port 5173)

### Access Points
- **Application**: http://localhost:5173
- **API Documentation**: http://localhost:8000/docs

### Default Test Accounts
- **Student**: `student1@example.com` / `password123`
- **Teacher**: `teacher1@example.com` / `password123`
- **Parent**: `parent1@example.com` / `password123`

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18 + TypeScript** for type-safe development
- **Vite** for fast development and building
- **Tailwind CSS** for responsive design
- **PWA** with offline capabilities
- **IndexedDB** for local data storage

### Backend Stack
- **FastAPI** with async support
- **SQLAlchemy + Alembic** for database management
- **JWT Authentication** with role-based access
- **pytest** with property-based testing

### Database Architecture
- **PostgreSQL**: User data, assessments, progress tracking
- **MongoDB**: Chat history, documents, content storage
- **Redis**: Sessions, caching, real-time features

### Local AI Stack
- **Ollama** with llama3.2:1b model for conversational AI
- **Whisper** for speech-to-text processing
- **Coqui TTS** for text-to-speech synthesis
- **ChromaDB** for vector storage and RAG

## 🎯 User Roles & Features

### For Students
- **AI Tutor Chat**: Voice-enabled conversational learning
- **Adaptive Quizzes**: Personalized difficulty adjustment
- **Gamification**: XP, achievements, streaks, leaderboards
- **Progress Tracking**: Visual learning analytics
- **Offline Learning**: Complete PWA functionality

### For Teachers
- **Class Management**: Student enrollment and monitoring
- **Assessment Creation**: Custom quizzes and rubrics
- **Analytics Dashboard**: Student performance insights
- **Content Management**: Curriculum material organization

### For Parents
- **Child Monitoring**: MultiPWA capabilitie trad sync mechanisms
- **Multi-stakeholdehts**: lows**: Teace and achievements
- **Communication**: Secure teacher messaging
- **Progress Reports**: Detailed performance analytics

## � Devealopment & Testing

### Development Commands
```bash
# Start all services
./start-dev.sh

# Backend development
cd backend && python run.py

# Frontend development  
cd frontend && npm run dev

# Database migrations
cd backend && alembic upgrade head
```

### Testing
```bash
# Backend tests
cd backend && pytest

# Frontend tests
cd frontend && npm test

# Integration tests
./test_voice_integration.sh
```

## � Privacy &t Security

- **100% Local Processing**: All AI operations on your server
- **Zero External APIs**: No third-party data transmission
- **JWT Authentication**: Secure token-based sessions
- **Role-based Access**: Granular user permissions
- **Data Encryption**: HTTPS and database encryption

## 📱 Platform Support

- **Desktop**: Windows, macOS, Linux (all modern browsers)
- **Mobile**: iOS Safari, Android Chrome (responsive design)
- **PWA**: Install as native app on any platform
- **Offline**: Full functionality without internet

## 🌍 Localization

- **Bengali (বাংলা)**: Complete UI and voice support
- **English**: Full interface and voice capabilities
- **NCTB Aligned**: Bangladesh curriculum standards
- **Cultural Context**: Locally relevant content

## 📊 Project Status

**Production Ready** - All core features implemented and tested:
- ✅ Multi-stakeholder dashboards (Student, Teacher, Parent)
- ✅ Local AI integration (Ollama + Whisper + Coqui TTS)
- ✅ Voice-enabled chat in Bengali and English
- ✅ Adaptive quiz system with RAG
- ✅ Gamification and progress tracking
- ✅ Offline PWA functionality
- ✅ Parent-child relationship management
- ✅ Teacher student enrollment system

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Run setup: `./start-dev.sh`
4. Make changes and test: `pytest` (backend), `npm test` (frontend)
5. Submit pull request

## 👥 Collaborators

### Core Team
- **[Your Name]** - Project Lead & Full-Stack Developer
  - GitHub: [@yourusername](https://github.com/yourusername)
  - Role: Architecture, AI Integration, Backend Development

### Contributors
- **[Contributor Name]** - Frontend Developer
  - GitHub: [@contributor1](https://github.com/contributor1)
  - Contributions: React components, PWA implementation

- **[Contributor Name]** - AI/ML Engineer
  - GitHub: [@contributor2](https://github.com/contributor2)
  - Contributions: RAG system, Voice integration

- **[Contributor Name]** - UI/UX Designer
  - GitHub: [@contributor3](https://github.com/contributor3)
  - Contributions: Design system, User experience

### Special Thanks
- **Open Source Community** - For the amazing tools and libraries

*Want to be listed here? Check out our [Contributing Guidelines](#-contributing) and submit your first PR!*

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**ShikkhaSathi** - Revolutionizing education in Bangladesh with AI-powered, culturally relevant, and privacy-focused learning. 🇧🇩

*Last Updated: December 2024 | Version: 2.0.0 | Status: Production Ready*