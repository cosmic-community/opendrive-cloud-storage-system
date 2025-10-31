# OpenDrive - Cloud Storage System

![OpenDrive Preview](https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&h=300&fit=crop&auto=format)

A full-stack Google Drive-style cloud storage application built with Django and React.js, featuring local file storage, folder organization, and modern UI.

## ✨ Features

- 🔐 User authentication (signup, login, logout) with JWT
- 📤 File upload with drag-and-drop support
- 📥 File download and viewing
- 📁 Folder organization and navigation
- ✏️ Rename and delete files/folders
- 🔍 Real-time file search
- 💾 Storage usage tracking
- 📱 Fully responsive design
- 🎨 Clean, modern Google Drive-inspired UI
- 🔗 Optional public file sharing links

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=6904f34c271316ad9f4ceea1&clone_repository=6904f4d0271316ad9f4ceead)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> No content model prompt provided - app built from scratch using Django models

### Code Generation Prompt

> Build a full-stack web application called OpenDrive — a Google Drive–style cloud storage system using Django (Python) for the backend and React.js (JavaScript) for the frontend. The app should let users sign up, log in, and upload, view, organize, and download files with a clean, modern UI — using only local file storage, no AWS or cloud setup required.

The app has been tailored to provide a complete cloud storage solution with all the features requested above.

## 🛠️ Technologies Used

**Backend:**
- Django 5.0
- Django REST Framework
- Django CORS Headers
- PyJWT (JSON Web Tokens)
- SQLite Database
- Pillow (Image processing)

**Frontend:**
- React.js 18
- Axios (API requests)
- React Router (Navigation)
- Tailwind CSS (Styling)
- Lucide React (Icons)

## 📋 Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- npm or yarn package manager

## 🚀 Getting Started

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create and activate virtual environment:**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run database migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Create superuser (optional):**
```bash
python manage.py createsuperuser
```

6. **Start Django development server:**
```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start React development server:**
```bash
npm start
```

Frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
OpenDrive/
├── backend/
│   ├── opendrive/          # Main Django project
│   │   ├── settings.py     # Project settings
│   │   ├── urls.py         # URL configuration
│   │   └── wsgi.py         # WSGI config
│   ├── api/                # Django app for API
│   │   ├── models.py       # Database models
│   │   ├── serializers.py  # DRF serializers
│   │   ├── views.py        # API views
│   │   └── urls.py         # API routes
│   ├── media/              # Uploaded files storage
│   ├── manage.py           # Django management script
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service
│   │   ├── App.js          # Main App component
│   │   └── index.js        # Entry point
│   ├── public/             # Static files
│   └── package.json        # Node dependencies
└── README.md               # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/register/` - User registration
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout

### Files
- `GET /api/files/` - List user files
- `POST /api/upload/` - Upload file
- `GET /api/files/{id}/` - Get file details
- `GET /api/files/{id}/download/` - Download file
- `PUT /api/files/{id}/rename/` - Rename file
- `DELETE /api/files/{id}/` - Delete file

### Folders
- `GET /api/folders/` - List folders
- `POST /api/folders/` - Create folder
- `DELETE /api/folders/{id}/` - Delete folder

### Storage
- `GET /api/storage/` - Get storage usage

## 🎨 UI Features

- **Dashboard Layout** - Sidebar navigation with My Drive, Recent, and Trash sections
- **File Grid/List View** - Toggle between grid and list layouts
- **Upload Modal** - Drag-and-drop file upload interface
- **Search Bar** - Real-time file search with results highlighting
- **Storage Meter** - Visual progress bar showing storage usage
- **File Icons** - Dynamic icons based on file types (PDF, images, documents)
- **Responsive Design** - Mobile-friendly interface with collapsible sidebar

## 🔒 Authentication

The application uses JWT (JSON Web Token) authentication:
- Tokens are stored in localStorage
- Automatic token refresh on API requests
- Protected routes require valid authentication
- Token expiration handling with automatic logout

## 💾 File Storage

Files are stored locally in the `backend/media/` directory:
- Original filenames are preserved
- File paths are stored in SQLite database
- Maximum upload size: 100MB (configurable)
- Supported file types: All formats
- Files are organized by user ID

## 🚀 Deployment Options

### Local Development
Follow the Getting Started guide above for local development setup.

### Production Deployment

**Backend (Django):**
1. Set `DEBUG=False` in settings.py
2. Configure `ALLOWED_HOSTS`
3. Use PostgreSQL instead of SQLite
4. Set up proper static files serving
5. Use Gunicorn or uWSGI
6. Deploy to Heroku, Railway, or DigitalOcean

**Frontend (React):**
1. Build production bundle: `npm run build`
2. Deploy to Vercel, Netlify, or GitHub Pages
3. Update API_BASE_URL to production backend URL

### Environment Variables

Create `.env` file in frontend directory:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 📝 Notes

- This project uses local file storage only (no AWS S3 or cloud storage)
- SQLite is used for development (consider PostgreSQL for production)
- Files are stored in `backend/media/` directory
- Maximum file upload size is configurable in Django settings
- JWT tokens expire after 24 hours (configurable)

## 🐛 Troubleshooting

**CORS Issues:**
- Ensure `django-cors-headers` is installed
- Check `CORS_ALLOWED_ORIGINS` in settings.py

**File Upload Errors:**
- Verify `media/` directory exists and is writable
- Check `MEDIA_ROOT` and `MEDIA_URL` settings
- Ensure file size is within limits

**Authentication Errors:**
- Clear localStorage and try logging in again
- Check token expiration settings
- Verify JWT secret key in settings

## 📄 License

This project is open source and available under the MIT License.

<!-- README_END -->