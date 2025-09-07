CAMPUS_EVENT_MANAGEMENT_PLATFORM ( mini version)


what?
This is a platform managed by the College Staff to create events (hackathons,
workshops, tech talks, fests, etc.). 

Campus_Event_Management_Platform/
├─ App.tsx ------------------------------# Main React app
├─ EventPages.tsx --------------------------# Event listing and registration page
├─ AttendancePage.tsx -------------------------# Attendance page (placeholder)
├─ FeedbackPage.tsx ------------------------------# Feedback page (placeholder)
├─ ReportsPage.tsx---------------------------------- # Reports page (placeholder)
├─ api/
│ └─ api.ts-------------- # Axios instance for API calls
├─ main.py ------------------# FastAPI backend endpoints
├─ models.py --------------------# Database models (SQLite)
├─ database.db ---------------------# Sample SQLite database
├─ package.json -----------------------# Frontend dependencies
├─ tsconfig.json -------------------------# TypeScript config
├─ README.md
├─ .gitignore


Steps?

Backend Setup (FastAPI)

1. Go project directory 
2. pip install -r requirements.txt in the virtual env u create by - python -v venv venv 
3. Run the backend server: uvicorn main:app --reload --host 127.0.0.1 --port 8000

output :
<img width="774" height="376" alt="image" src="https://github.com/user-attachments/assets/9dc0c1ef-24e8-4214-bb17-acb0edfbdf02" />
The API will run on http://127.0.0.1:8000
then change the url to http://127.0.0.1:8000/docs

and try these out :

Example endpoints:
GET /events → Get all events
POST /register → Register a student for an event

https://github.com/user-attachments/assets/f530900e-dc51-4088-b92f-6007b5e68260


overall look :
"https://github.com/user-attachments/assets/7c7655eb-fcd0-44fd-8d87-4a0cf8434090" 

we can also test the api points on postman 






Frontend Setup (React + Vite)
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

i used vercel for the frontend :

"https://github.com/user-attachments/assets/a1e1486b-9fdc-4413-8ce7-f53999c4d487"



This project is a working prototype — additional features like attendance tracking, feedback collection, and advanced reports can be added later
