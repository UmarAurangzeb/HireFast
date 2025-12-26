
HireFast is a job portal and recruitment management system developed as part of Database Systems course project at FAST NUCES Karachi.
The platform supports two RBAC roles (Recruiter & Student) and enables recruiters to post jobs while students can browse and apply for opportunities.

The project emphasizes relational database design, role-based access control, and real-world CRUD workflows using a modern full-stack web architecture.

--------------------------------------------------

FEATURES

Recruiter:
- Sign up & login
- Register and manage company profile
- Post job listings
- View applicants for posted jobs

Student:
- Sign up & login
- Browse available jobs
- View job details
- Apply to jobs
- View submitted applications

Authentication & Authorization:
- Role-based access control (TBAC)
- Separate permissions for recruiters and students

--------------------------------------------------

TECH STACK

Frontend:
- React.js (Vite)
- Axios

Backend:
- Node.js
- Express.js
- REST APIs

Database & Auth:
- PostgreSQL
- Supabase (Database & Authentication)

--------------------------------------------------

PROJECT STRUCTURE

HireFast/
|-- Backend/
|   |-- controllers/
|   |-- models/
|   |-- routes/
|   |-- server.js
|-- public/
|-- src/
|   |-- components/
|   |-- pages/
|   |-- services/
|   |-- App.jsx
|-- .gitignore
|-- README.md
|-- package.json
|-- tsconfig.json
|-- vite.config.js

--------------------------------------------------

INSTALLATION & SETUP

1. Clone the repository:
git clone https://github.com/UmarAurangzeb/HireFast.git
cd HireFast

2. Backend setup:
cd Backend
npm install

Create a .env file inside Backend:
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
DATABASE_URL=your_postgres_connection_string

Run backend:
npm run dev

3. Frontend setup:
cd ../
npm install
npm run dev

Frontend runs on:
http://localhost:5173

--------------------------------------------------

DATABASE DESIGN OVERVIEW

Entities:
- Users (Students & Recruiters)
- Companies
- Jobs
- Applications

Relationships:
- Recruiter manages one company
- Company posts multiple jobs
- Student applies to multiple jobs
- Job has multiple applicants

--------------------------------------------------

COURSE INFORMATION

Course: Database Systems
University: FAST NUCES Karachi
Purpose: Academic project demonstrating relational database concepts and full-stack integration

--------------------------------------------------

FUTURE ENHANCEMENTS

- AI-based resume screening
- Job recommendation system
- Admin dashboard
- Email notifications
- Resume upload & parsing
- Improved UI/UX

--------------------------------------------------

AUTHOR

Umar Aurangzeb
BSCS – FAST NUCES Karachi
React & Full-Stack Developer

--------------------------------------------------

LICENSE

This project is developed for academic purposes.
Free to fork and modify for learning and non-commercial use.
