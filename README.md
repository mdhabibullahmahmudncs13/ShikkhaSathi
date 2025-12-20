# ShikkhaSathi - AI-Powered Learning Platform for Bangladesh

**100% Local AI - Zero External API Dependencies**

ShikkhaSathi is an AI-powered adaptive learning platform specifically designed for Bangladesh students (Grades 6-12). The platform provides personalized education experiences with complete privacy and zero API costs.

## 🎉 Project Highlights

- **Local AI Implementation**: Fully local AI stack with no external API dependencies.
- **Voice Integration**: Speech-to-text and text-to-speech in Bengali and English.
- **Gamified Learning**: XP, achievements, streaks, and leaderboards.
- **Adaptive Assessments**: Dynamic quizzes tailored to student performance.
- **Offline-First Design**: Progressive Web App (PWA) with offline capabilities.
- **Multi-Stakeholder Support**: Features for students, teachers, and parents.

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- Docker (for databases)
- 8GB RAM minimum (16GB recommended)
- 5GB free disk space (for AI models)

### Setup Instructions

```bash
# Clone the repository
git clone <your-repo-url>
cd ShikkhaSathi

# Run automated local AI setup
python3 setup_local_voice.py

# Start databases
docker-compose up -d

# Start backend
cd backend
python3 run.py

# Start frontend (in another terminal)
cd frontend
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **API Documentation**: http://localhost:8000/docs

## ✨ Core Features

### Authentication and User Management
- JWT-based authentication with role-based access control.
- Secure password hashing and session management.
- User registration, login, and profile management.

### AI-Powered Learning
- **RAG System**: Curriculum-aligned responses using local vector database.
- **AI Tutor Chat**: Real-time chat interface with voice input/output.
- **Adaptive Quiz System**: Dynamic quizzes with Bloom's taxonomy levels.

### Gamification
- XP calculation and level progression.
- Achievements and streak tracking.
- Leaderboards for friendly competition.

### Multi-Stakeholder Support
- **Students**: Personalized learning paths and progress tracking.
- **Teachers**: Analytics, custom assessments, and class management.
- **Parents**: Child progress monitoring and notifications.

### Offline-First Design
- Service worker for caching and offline functionality.
- IndexedDB for local data storage and synchronization.
- Content download system for offline access.

## 🏗️ Technical Architecture

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- PWA with offline support

### Backend
- FastAPI with async support
- PostgreSQL, MongoDB, Redis for data management
- Local AI services (Ollama, Whisper, Coqui TTS)

### Local AI Stack
- **LLM**: Ollama with llama2
- **Speech-to-Text**: OpenAI Whisper
- **Text-to-Speech**: Coqui TTS
- **Vector Database**: ChromaDB

## 🧪 Testing

- **Backend Tests**: 90 tests with 100% pass rate.
- **Frontend Tests**: 42 tests with 100% pass rate.
- **Property Tests**: Validating core functionalities like authentication, RAG responses, and offline capabilities.

## 💰 Cost Comparison

- **Before**: $50-200+ monthly API costs.
- **After**: $0 monthly costs with local AI models.

## 🔒 Privacy & Security

- All data processed locally.
- No external API calls for AI.
- GDPR compliant and offline capable.

## 🎯 Target Users

- **Students**: Grades 6-12 (Bangla & English medium).
- **Teachers**: Assessment creation and analytics.
- **Parents**: Progress monitoring and notifications.

## 🛠️ Development Progress

### Completed Milestones

1. **Project Setup**: Frontend, backend, and database infrastructure.
2. **Authentication**: Secure user management system.
3. **RAG System**: Document processing and query generation.
4. **Adaptive Quiz System**: Dynamic quizzes with feedback.
5. **Gamification**: XP, achievements, and leaderboards.
6. **AI Tutor Chat**: Real-time chat with voice support.
7. **Offline Functionality**: PWA with IndexedDB and caching.
8. **Teacher Dashboard**: Analytics and assessment tools.
9. **Parent Portal**: Progress monitoring and notifications.

### Final Validation
- ✅ All 132 tests passing across the system.
- ✅ Comprehensive error handling and logging.
- ✅ End-to-end user workflows implemented.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

## License

This project is licensed under the MIT License.

## 🎉 Final Notes

ShikkhaSathi is a groundbreaking platform that combines cutting-edge AI with cultural relevance to empower students in Bangladesh. With its offline capabilities, zero API costs, and bilingual support, it is poised to revolutionize education in the region. Join us in making a difference!

