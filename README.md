# ShikkhaSathi - AI-Powered Learning Platform for Bangladesh

**100% Local AI - Zero External API Dependencies**

ShikkhaSathi is an AI-powered adaptive learning platform specifically designed for Bangladesh students (Grades 6-12). The platform provides personalized education experiences with complete privacy and zero API costs.

## 🎉 **NEW: Fully Local AI Implementation**

ShikkhaSathi now runs **completely locally** with no external AI API dependencies:

- ✅ **Local AI Tutor**: Ollama with llama2 model
- ✅ **Local Speech-to-Text**: OpenAI Whisper (base model)
- ✅ **Local Text-to-Speech**: Coqui TTS
- ✅ **Local Vector Database**: ChromaDB for RAG
- ✅ **Zero API Costs**: No OpenAI, ElevenLabs, or Pinecone charges
- ✅ **Complete Privacy**: All data processed locally
- ✅ **Offline Capable**: Works without internet connection

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- Docker (for databases)
- 8GB RAM minimum (16GB recommended)
- 5GB free disk space (for AI models)

### Automated Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd ShikkhaSathi

# Run automated local AI setup
python3 setup_local_voice.py

# Start databases
docker-compose up -d

# Start Ollama (if not running)
ollama serve

# Start backend
cd backend
python3 run.py

# Start frontend (in another terminal)
cd frontend
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **AI Tutor Chat**: http://localhost:5173/chat
- **API Documentation**: http://localhost:8000/docs

## 📚 Documentation

- **[LOCAL_LLM_SUCCESS_SUMMARY.md](LOCAL_LLM_SUCCESS_SUMMARY.md)** - Complete success report
- **[LOCAL_LLM_SETUP_GUIDE.md](LOCAL_LLM_SETUP_GUIDE.md)** - Detailed setup instructions
- **[LOCAL_LLM_MIGRATION_TASKS.md](LOCAL_LLM_MIGRATION_TASKS.md)** - Complete task breakdown
- **[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)** - Migration overview

## ✨ Core Features

### AI-Powered Learning
- **AI Tutor Chat**: Interactive tutoring with local LLM
- **Voice Learning**: Speech-to-text and text-to-speech in Bengali & English
- **RAG System**: Curriculum-aligned responses using local vector database
- **Adaptive Assessments**: Dynamic quizzes that adjust to student performance

### Multi-Stakeholder Support
- **Students**: Personalized learning with voice support
- **Teachers**: Assessment creation and analytics
- **Parents**: Progress tracking and notifications

### Offline-First Design
- **PWA**: Progressive Web App with offline capabilities
- **Local Processing**: All AI operations run locally
- **No Internet Required**: Core features work offline

### Gamification
- **XP System**: Earn points for learning activities
- **Achievements**: Unlock badges and rewards
- **Streaks**: Maintain learning consistency
- **Leaderboards**: Friendly competition

## 🏗️ Technical Architecture

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- PWA with offline support

### Backend
- FastAPI with async support
- Local AI services (Ollama, Whisper, Coqui TTS)
- PostgreSQL, MongoDB, Redis
- ChromaDB for vector storage

### Local AI Stack
- **LLM**: Ollama with llama2 (3.8GB)
- **Speech-to-Text**: OpenAI Whisper base (74MB)
- **Text-to-Speech**: Coqui TTS (200MB)
- **Vector DB**: ChromaDB for RAG
- **Embeddings**: Local Ollama embeddings

## 🧪 Testing

```bash
# Test local voice services
cd backend
python3 test_local_voice.py

# Test AI tutor
python3 test_ollama.py

# Test frontend
cd frontend
npm test
```

## 💰 Cost Comparison

### Before (External APIs)
- OpenAI Whisper: $0.006/minute
- ElevenLabs TTS: $0.30/1K chars
- **Monthly Cost**: $50-200+

### After (Local Models)
- All Services: $0/request
- **Monthly Cost**: $0
- **Savings**: 100%

## 🔒 Privacy & Security

- ✅ All voice data processed locally
- ✅ No external API calls for AI
- ✅ Complete data sovereignty
- ✅ GDPR compliant
- ✅ Offline capable

## 📊 Performance

- **AI Response**: 2-5 seconds
- **Speech-to-Text**: 1-3 seconds
- **Text-to-Speech**: 2-4 seconds
- **RAM Usage**: 4-6GB
- **Storage**: ~5GB for models

## 🌍 Language Support

- **Bengali**: Full support for speech and text
- **English**: Full support for speech and text
- **Auto-Detection**: Automatic language identification

## 🎯 Target Users

- **Students**: Grades 6-12 (Bangla & English medium)
- **Teachers**: Assessment creation and analytics
- **Parents**: Progress monitoring
- **Schools**: Cost-effective, private AI solution

## 🛠️ Development

### Project Structure
```
ShikkhaSathi/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── services/    # Local AI services
│   │   ├── api/         # API endpoints
│   │   └── models/      # Database models
│   └── tests/           # Backend tests
├── frontend/            # React frontend
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   └── services/   # API clients
│   └── tests/          # Frontend tests
└── docs/               # Documentation
```

### Key Commands

```bash
# Backend development
cd backend
python3 run.py

# Frontend development
cd frontend
npm run dev

# Run tests
python3 test_local_voice.py  # Backend voice tests
python3 test_ollama.py       # Backend AI tests
npm test                     # Frontend tests

# Build for production
npm run build                # Frontend
```

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

