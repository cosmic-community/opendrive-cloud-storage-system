# OpenDrive - Cloud Storage System

A modern cloud storage system built with React (frontend) and Django (backend).

## Architecture

- **Frontend**: React application in `/frontend` directory
- **Backend**: Django REST API in `/backend` directory

## Deployment

### Frontend (Vercel)
The React frontend is configured to deploy on Vercel automatically from the `frontend/` directory.

### Backend (Separate Hosting)
The Django backend should be deployed separately on a platform like:
- Railway
- Render
- Heroku
- DigitalOcean

## Local Development

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Environment Variables

### Frontend (.env in frontend/)