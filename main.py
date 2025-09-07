

from fastapi import FastAPI
from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy import func

class StudentCreate(BaseModel):
    name: str
    email: EmailStr
    college_id: int

class EventCreate(BaseModel):
    title: str
    event_type: str
    college_id: int
    date: str

class RegisterStudent(BaseModel):
    student_id: int
    event_id: int

class AttendanceMark(BaseModel):
    registration_id: int
    present: int  # 0 or 1

class FeedbackCreate(BaseModel):
    registration_id: int
    rating: int
    comment: Optional[str] = None

# FastAPI app
app = FastAPI(title="Campus Event Management")

# Database setup (SQLite)
DATABASE_URL = "sqlite:///./events.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Models
class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    college_id = Column(Integer)

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    event_type = Column(String)
    college_id = Column(Integer)
    date = Column(String)   # for simplicity, storing as string

class Registration(Base):
    __tablename__ = "registrations"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    event_id = Column(Integer, ForeignKey("events.id"))

    student = relationship("Student")
    event = relationship("Event")

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    registration_id = Column(Integer, ForeignKey("registrations.id"), unique=True)
    present = Column(Integer, default=0)  # 0 = absent, 1 = present

    registration = relationship("Registration")

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    registration_id = Column(Integer, ForeignKey("registrations.id"), unique=True)
    rating = Column(Integer)  # 1–5
    comment = Column(String, nullable=True)

    registration = relationship("Registration")

# Create tables
Base.metadata.create_all(bind=engine)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Campus Event Management API is running 🚀"}

@app.post("/students")
def create_student(student: StudentCreate):
    db = SessionLocal()
    new_student = Student(name=student.name, email=student.email, college_id=student.college_id)
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    db.close()
    return {"id": new_student.id, "name": new_student.name, "email": new_student.email}

@app.post("/events")
def create_event(event: EventCreate):
    db = SessionLocal()
    new_event = Event(title=event.title, event_type=event.event_type,
                      college_id=event.college_id, date=event.date)
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    db.close()
    return {"id": new_event.id, "title": new_event.title, "event_type": new_event.event_type}

@app.post("/register")
def register_student(data: RegisterStudent):
    db = SessionLocal()
    # check duplicate registration
    existing = db.query(Registration).filter_by(student_id=data.student_id, event_id=data.event_id).first()
    if existing:
        db.close()
        return {"error": "Student already registered for this event"}
    
    reg = Registration(student_id=data.student_id, event_id=data.event_id)
    db.add(reg)
    db.commit()
    db.refresh(reg)
    db.close()
    return {"message": "Student registered", "registration_id": reg.id}


@app.post("/attendance")
def mark_attendance(data: AttendanceMark):
    db = SessionLocal()
    reg = db.query(Registration).filter_by(id=data.registration_id).first()
    if not reg:
        db.close()
        return {"error": "Registration not found"}
    
    att = db.query(Attendance).filter_by(registration_id=data.registration_id).first()
    if att:
        att.present = data.present
    else:
        att = Attendance(registration_id=data.registration_id, present=data.present)
        db.add(att)
    
    db.commit()
    db.refresh(att)
    db.close()
    return {"message": "Attendance marked", "attendance_id": att.id, "present": att.present}


@app.post("/feedback")
def submit_feedback(data: FeedbackCreate):
    db = SessionLocal()
    reg = db.query(Registration).filter_by(id=data.registration_id).first()
    if not reg:
        db.close()
        return {"error": "Registration not found"}
    
    fb = db.query(Feedback).filter_by(registration_id=data.registration_id).first()
    if fb:
        fb.rating = data.rating
        fb.comment = data.comment
    else:
        fb = Feedback(registration_id=data.registration_id, rating=data.rating, comment=data.comment)
        db.add(fb)
    
    db.commit()
    db.refresh(fb)
    db.close()
    return {"message": "Feedback saved", "feedback_id": fb.id, "rating": fb.rating}

# 1. Total registrations per event
@app.get("/reports/registrations")
def registrations_report():
    db = SessionLocal()
    results = (
        db.query(Event.title, func.count(Registration.id).label("registrations"))
        .outerjoin(Registration, Event.id == Registration.event_id)
        .group_by(Event.id)
        .order_by(func.count(Registration.id).desc())
        .all()
    )
    db.close()
    return [{"event": r[0], "registrations": r[1]} for r in results]


# 2. Attendance percentage per event
@app.get("/reports/attendance")
def attendance_report():
    db = SessionLocal()
    results = (
        db.query(
            Event.title,
            (func.sum(func.coalesce(Attendance.present, 0)) * 100.0 / func.nullif(func.count(Registration.id), 0)).label("attendance_pct")
        )
        .outerjoin(Registration, Event.id == Registration.event_id)
        .outerjoin(Attendance, Registration.id == Attendance.registration_id)
        .group_by(Event.id)
        .all()
    )
    db.close()
    return [{"event": r[0], "attendance_pct": round(r[1] or 0, 2)} for r in results]


# 3. Average feedback per event
@app.get("/reports/feedback")
def feedback_report():
    db = SessionLocal()
    results = (
        db.query(Event.title, func.avg(Feedback.rating).label("avg_rating"))
        .outerjoin(Registration, Event.id == Registration.event_id)
        .outerjoin(Feedback, Registration.id == Feedback.registration_id)
        .group_by(Event.id)
        .all()
    )
    db.close()
    return [{"event": r[0], "avg_rating": round(r[1], 2) if r[1] else None} for r in results]


# 4. Student participation report
@app.get("/reports/student/{student_id}")
def student_participation(student_id: int):
    db = SessionLocal()
    results = (
        db.query(Student.name, func.count(Attendance.id).label("attended"))
        .join(Registration, Student.id == Registration.student_id)
        .join(Attendance, Registration.id == Attendance.registration_id)
        .filter(Student.id == student_id, Attendance.present == 1)
        .group_by(Student.id)
        .first()
    )
    db.close()
    if results:
        return {"student": results[0], "attended_events": results[1]}
    return {"student_id": student_id, "attended_events": 0}


# 5. Top 3 most active students
@app.get("/reports/top-active")
def top_active_students(limit: int = 3):
    db = SessionLocal()
    results = (
        db.query(Student.name, func.count(Attendance.id).label("attended"))
        .join(Registration, Student.id == Registration.student_id)
        .join(Attendance, Registration.id == Attendance.registration_id)
        .filter(Attendance.present == 1)
        .group_by(Student.id)
        .order_by(func.count(Attendance.id).desc())
        .limit(limit)
        .all()
    )
    db.close()
    return [{"student": r[0], "attended": r[1]} for r in results]