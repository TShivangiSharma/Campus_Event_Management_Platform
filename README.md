CAMPUS_EVENT_MANAGEMENT_PLATFORM ( mini version)


what?
This is a platform managed by the College Staff to create events (hackathons,
workshops, tech talks, fests, etc.). 

campus-event-management/
├─ backend/ # FastAPI backend
│ ├─ main.py # API endpoints
│ ├─ models.py # Database models
│ ├─ database.db # SQLite database (example)
├─ frontend/ # React + Vite frontend
│ ├─ src/
│ │ ├─ App.tsx
│ │ ├─ pages/
│ │ ├─ components/
│ │ └─ api/api.ts
│ └─ package.json
├─ README.md
├─ .gitignore


Steps?

Backend Setup (FastAPI)

1. Go to the backend folder:
2. cd backend
3. Install dependencies: pip install fastapi uvicorn sqlalchemy
4. Run the backend server: uvicorn main:app --reload --host 127.0.0.1 --port 8000

The API will run on http://127.0.0.1:8000

Example endpoints:
GET /events → Get all events
POST /register → Register a student for an event


Frontend Setup (React + Vite)

5. Go to the frontend folder:
6.cd frontend
7.Install dependencies:
8.npm install
9.Run the frontend:
10.npm run dev

The app will run on http://localhost:5173
(It fetches events from the backend and allows student registration.)

Features?

->Display a list of events with title, description, and date
->Register for events (hardcoded student for demo)
->Navbar with pages for Events, Attendance, Feedback, and Reports
->Responsive UI using TailwindCSS

STEP BY STEP :




This project is a working prototype — additional features like attendance tracking, feedback collection, and advanced reports can be added later
