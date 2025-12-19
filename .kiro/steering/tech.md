# Technology Stack & Build System

## Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Styling**: Tailwind CSS
- **PWA**: Vite PWA plugin with Workbox for offline functionality
- **Testing**: Vitest with React Testing Library and jsdom
- **State Management**: React hooks and context
- **HTTP Client**: Axios
- **Offline Storage**: Dexie (IndexedDB wrapper)
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Backend Stack
- **Framework**: FastAPI with async/await support
- **Runtime**: Python 3.9+ with uvicorn ASGI server
- **Database ORM**: SQLAlchemy with Alembic migrations
- **Authentication**: python-jose with JWT tokens
- **Password Hashing**: passlib with bcrypt
- **Testing**: pytest with hypothesis for property-based testing
- **Rate Limiting**: slowapi
- **Environment**: python-decouple for configuration

## Databases
- **PostgreSQL**: Primary relational database for user data, assessments
- **MongoDB**: Document storage for content, chat history, RAG documents
- **Redis**: Caching, session storage, real-time features

## AI & ML Stack
- **LLM Integration**: OpenAI API via langchain
- **Vector Database**: Pinecone for embeddings and similarity search
- **Document Processing**: PyPDF2, pytesseract, Pillow
- **Text Processing**: tiktoken for tokenization, langdetect for language detection
- **Voice**: ElevenLabs API integration

## Development Environment
- **Containerization**: Docker Compose for local development
- **Database Migrations**: Alembic for PostgreSQL schema management
- **Code Quality**: ESLint for frontend, pytest for backend testing
- **Package Management**: npm for frontend, pip for backend

## Common Commands

### Development Setup
```bash
# Start all services
./start-dev.sh

# Backend development
cd backend
python run.py  # Starts on localhost:8000

# Frontend development  
cd frontend
npm run dev    # Starts on localhost:5173
```

### Testing
```bash
# Frontend tests
cd frontend
npm test              # Watch mode
npm run test:run      # Single run

# Backend tests
cd backend
pytest                # Run all tests
pytest -v             # Verbose output
```

### Database Management
```bash
# Run migrations
cd backend
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "description"
```

### Build & Deploy
```bash
# Frontend production build
cd frontend
npm run build

# Backend with production settings
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Configuration
- Frontend config in `vite.config.ts` and `package.json`
- Backend config in `app/core/config.py` with `.env` file support
- Database connections configured in `docker-compose.yml`
- PWA manifest and service worker configured in Vite config