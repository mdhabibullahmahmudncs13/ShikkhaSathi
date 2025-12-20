# 🚀 ShikkhaSathi - Quick Start Guide

**Both Frontend & Backend Access Guide**

---

## 📍 **Access URLs**

### **Frontend Application**
- **URL**: http://localhost:5173
- **Status**: ✅ Running
- **Framework**: React 18 + TypeScript + Vite

### **Backend API**
- **URL**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **Health Check**: http://localhost:8000/health
- **Status**: ✅ Running
- **Framework**: FastAPI + Python

---

## 🌐 **FRONTEND - Available Pages**

### **1. Landing Page** 
**URL**: http://localhost:5173/

Features:
- Platform overview
- Feature highlights
- Pricing information
- Contact form

### **2. Login Page**
**URL**: http://localhost:5173/login

Features:
- Email/password authentication
- Google Sign-In option
- Remember me functionality
- Forgot password link
- Bengali language support

### **3. Sign Up Page**
**URL**: http://localhost:5173/signup

Features:
- New user registration
- Role selection (Student/Teacher/Parent)
- Email verification
- Terms and conditions

### **4. Student Dashboard**
**URL**: http://localhost:5173/student

Features:
- XP and level display
- Progress tracking
- Achievement badges
- Streak counter
- Subject performance
- Recent activities
- Quick actions (Quiz, AI Tutor, Study)

### **5. AI Tutor Chat**
**URL**: http://localhost:5173/chat

Features:
- Real-time AI conversation
- Voice input (Bengali + English)
- Voice output (Text-to-Speech)
- Curriculum-aligned responses
- Chat history
- Export conversations
- Voice settings

### **6. Quiz System**
**URL**: http://localhost:5173/quiz

Features:
- Subject selection
- Difficulty levels
- Adaptive questions
- Real-time scoring
- XP rewards
- Performance analytics
- Review answers

### **7. Teacher Dashboard**
**URL**: http://localhost:5173/teacher

Features:
- Student roster
- Assessment creation
- Performance analytics
- Notification center
- Class management
- Assignment tracking

### **8. Parent Portal**
**URL**: http://localhost:5173/parent

Features:
- Multi-child management
- Progress overview
- Achievement notifications
- Study time tracking
- Performance reports
- Communication with teachers

### **9. User Profile**
**URL**: http://localhost:5173/profile

Features:
- Profile settings
- Account preferences
- Notification settings
- Privacy controls
- Language preferences

---

## 🔧 **BACKEND - API Endpoints**

### **Base URL**: `http://localhost:8000/api/v1`

### **1. Authentication Endpoints**

#### **POST** `/auth/register`
Register a new user
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "full_name": "Test Student",
    "role": "student",
    "grade": 9
  }'
```

#### **POST** `/auth/login`
Login and get access token
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

#### **GET** `/auth/me`
Get current user info
```bash
curl -X GET "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### **2. Voice Endpoints**

#### **POST** `/voice/synthesize`
Convert text to speech
```bash
curl -X POST "http://localhost:8000/api/v1/voice/synthesize" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Welcome to ShikkhaSathi",
    "language": "en"
  }'
```

**Response:**
```json
{
  "success": true,
  "audio_id": "uuid-here",
  "audio_url": "/api/v1/voice/audio/uuid-here",
  "text": "Welcome to ShikkhaSathi",
  "language": "en",
  "fallback": false
}
```

#### **POST** `/voice/transcribe`
Convert speech to text
```bash
curl -X POST "http://localhost:8000/api/v1/voice/transcribe" \
  -F "audio_file=@recording.wav" \
  -F "language=auto"
```

#### **GET** `/voice/audio/{audio_id}`
Download generated audio file
```bash
curl -X GET "http://localhost:8000/api/v1/voice/audio/{audio_id}" \
  --output audio.wav
```

#### **GET** `/voice/capabilities`
Get voice service capabilities
```bash
curl -X GET "http://localhost:8000/api/v1/voice/capabilities"
```

---

### **3. Chat Endpoints**

#### **POST** `/chat/message`
Send message to AI tutor
```bash
curl -X POST "http://localhost:8000/api/v1/chat/message" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "message": "Explain Newton'\''s First Law",
    "subject": "physics",
    "grade": 9,
    "language": "en"
  }'
```

#### **GET** `/chat/history`
Get chat history
```bash
curl -X GET "http://localhost:8000/api/v1/chat/history?limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### **4. Quiz Endpoints**

#### **GET** `/quiz/subjects`
Get available subjects
```bash
curl -X GET "http://localhost:8000/api/v1/quiz/subjects?grade=9"
```

#### **POST** `/quiz/generate`
Generate quiz questions
```bash
curl -X POST "http://localhost:8000/api/v1/quiz/generate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "subject": "physics",
    "grade": 9,
    "difficulty": "medium",
    "num_questions": 10
  }'
```

#### **POST** `/quiz/submit`
Submit quiz answers
```bash
curl -X POST "http://localhost:8000/api/v1/quiz/submit" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "quiz_id": "quiz-uuid",
    "answers": [
      {"question_id": "q1", "answer": "A"},
      {"question_id": "q2", "answer": "B"}
    ]
  }'
```

---

### **5. Progress Endpoints**

#### **GET** `/progress/dashboard`
Get student dashboard data
```bash
curl -X GET "http://localhost:8000/api/v1/progress/dashboard" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### **GET** `/progress/analytics`
Get detailed analytics
```bash
curl -X GET "http://localhost:8000/api/v1/progress/analytics?period=week" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### **6. Gamification Endpoints**

#### **GET** `/gamification/xp`
Get XP and level info
```bash
curl -X GET "http://localhost:8000/api/v1/gamification/xp" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### **GET** `/gamification/achievements`
Get achievements
```bash
curl -X GET "http://localhost:8000/api/v1/gamification/achievements" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### **GET** `/gamification/leaderboard`
Get leaderboard
```bash
curl -X GET "http://localhost:8000/api/v1/gamification/leaderboard?period=week&limit=10"
```

---

### **7. Teacher Endpoints**

#### **GET** `/teacher/students`
Get student roster
```bash
curl -X GET "http://localhost:8000/api/v1/teacher/students" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### **POST** `/teacher/assessment`
Create assessment
```bash
curl -X POST "http://localhost:8000/api/v1/teacher/assessment" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Physics Quiz 1",
    "subject": "physics",
    "grade": 9,
    "questions": [...]
  }'
```

#### **GET** `/teacher/analytics`
Get class analytics
```bash
curl -X GET "http://localhost:8000/api/v1/teacher/analytics?class_id=class-uuid" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### **8. Parent Endpoints**

#### **GET** `/parent/children`
Get children list
```bash
curl -X GET "http://localhost:8000/api/v1/parent/children" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### **GET** `/parent/progress/{child_id}`
Get child progress
```bash
curl -X GET "http://localhost:8000/api/v1/parent/progress/child-uuid" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🧪 **Testing the System**

### **1. Test Voice Integration**
```bash
./test_voice_integration.sh
```

### **2. Test AI Tutor**
```bash
cd backend && python3 test_ollama.py
```

### **3. Test Local Voice Services**
```bash
cd backend && python3 test_local_voice.py
```

### **4. Run Frontend Tests**
```bash
cd frontend && npm run test:run
```

### **5. Run Backend Tests**
```bash
cd backend && pytest -v
```

---

## 🎯 **Quick Demo Flow**

### **For Students:**
1. Visit http://localhost:5173
2. Click "Get Started" or "Sign Up"
3. Create student account
4. Login and explore dashboard
5. Try AI Tutor Chat with voice
6. Take a quiz
7. Check progress and XP

### **For Teachers:**
1. Sign up as teacher
2. Access teacher dashboard
3. Create assessment
4. View student analytics
5. Manage notifications

### **For Parents:**
1. Sign up as parent
2. Add children
3. View progress reports
4. Check achievements
5. Monitor study time

---

## 🔑 **Key Features to Explore**

### **Frontend Features:**
- ✅ Responsive design (mobile-friendly)
- ✅ Dark/light mode support
- ✅ Bengali language interface
- ✅ Offline PWA capabilities
- ✅ Real-time updates
- ✅ Voice interaction
- ✅ Gamification elements

### **Backend Features:**
- ✅ RESTful API design
- ✅ JWT authentication
- ✅ Local AI processing (Ollama)
- ✅ Voice services (Whisper + Coqui TTS)
- ✅ RAG system (ChromaDB)
- ✅ Multi-database architecture
- ✅ Comprehensive error handling

---

## 📱 **Mobile Access**

The frontend is fully responsive and works on mobile devices:

1. Find your local IP address:
```bash
hostname -I | awk '{print $1}'
```

2. Access from mobile browser:
```
http://YOUR_IP_ADDRESS:5173
```

---

## 🐛 **Troubleshooting**

### **Frontend not loading?**
```bash
cd frontend
npm run dev
```

### **Backend not responding?**
```bash
cd backend
python3 run.py
```

### **Database connection issues?**
```bash
sudo docker compose ps
sudo docker compose up -d postgres mongodb redis
```

### **Voice services not working?**
```bash
cd backend
python3 test_local_voice.py
```

---

## 📚 **API Documentation**

**Interactive API Docs**: http://localhost:8000/docs

Features:
- Try out endpoints directly
- See request/response schemas
- Authentication testing
- Example requests
- Response codes

**Alternative API Docs**: http://localhost:8000/redoc

---

## 🎨 **UI Components**

The frontend uses:
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Custom components** in `src/components/`
- **Responsive design** for all screen sizes
- **Bengali fonts** for native language support

---

## 🔐 **Authentication Flow**

1. **Register**: POST `/api/v1/auth/register`
2. **Login**: POST `/api/v1/auth/login` → Get access token
3. **Use Token**: Add header `Authorization: Bearer YOUR_TOKEN`
4. **Refresh**: POST `/api/v1/auth/refresh` (if needed)
5. **Logout**: Clear local storage

---

## 💾 **Data Storage**

### **Frontend (Browser)**
- **LocalStorage**: Auth tokens, user preferences
- **IndexedDB**: Offline content, quiz data
- **Service Worker**: Cached assets

### **Backend (Databases)**
- **PostgreSQL**: Users, assessments, progress
- **MongoDB**: Chat history, documents
- **Redis**: Sessions, cache

---

## 🚀 **Next Steps**

1. **Explore the Frontend**: http://localhost:5173
2. **Try the API**: http://localhost:8000/docs
3. **Test Voice Features**: Use AI Tutor Chat
4. **Take a Quiz**: Test adaptive learning
5. **Check Analytics**: View progress dashboard

---

## 📞 **Support**

- **Documentation**: See README.md
- **API Reference**: http://localhost:8000/docs
- **Test Scripts**: `./test_voice_integration.sh`
- **Logs**: Check browser console and terminal

---

**🎓 ShikkhaSathi - Empowering Bangladesh students through AI-powered learning!**

**Status**: ✅ Both Frontend & Backend Running
**Ready for**: Development, Testing, Demonstration
