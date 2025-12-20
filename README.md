# ShikkhaSathi

ShikkhaSathi is an advanced educational platform designed to enhance learning experiences through adaptive technologies, voice integration, and AI-driven insights. This project aims to provide a comprehensive solution for students, teachers, and parents to collaborate effectively.

## Features
- Adaptive learning modules
- Voice-enabled interactions
- AI-powered analytics for teachers
- Parent portal for monitoring student progress
- Quiz and assessment tools

## Prerequisites
- Python 3.8+
- Node.js 16+
- Docker (optional, for containerized deployment)

## Setup Instructions

### Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the backend server:
   ```bash
   python run.py
   ```

### Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Running Tests

### Backend Tests
Run the following command in the `backend` directory:
```bash
pytest
```

### Frontend Tests
Run the following command in the `frontend` directory:
```bash
npm test
```

## Deployment
For production deployment, use the `docker-compose.yml` file to set up the entire stack:
```bash
docker-compose up --build
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

