# Job Portal - Fullstack Demo

A modern job portal application built with React (frontend) and Node.js/Express (backend) with MongoDB database. This demo showcases user authentication, job posting/viewing, and resume upload functionality.

## Features

### Authentication
- **User Registration**: Support for both Jobseekers and Employers
- **User Login**: Secure authentication with JWT tokens
- **Profile Management**: View and update user profiles

### Job Management
- **Job Posting**: Employers can create detailed job postings
- **Job Browsing**: Advanced search and filtering capabilities
- **Job Applications**: Jobseekers can apply with uploaded resumes
- **Application Tracking**: Employers can manage and update application status

### Resume Management
- **File Upload**: Support for PDF and Word documents (up to 5MB)
- **Resume Storage**: Secure file storage with metadata
- **Resume Management**: View, download, and delete uploaded resumes

## Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing

## Project Structure

```
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers
│   │   └── App.jsx         # Main application component
│   └── package.json
├── backend/                  # Node.js backend application
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Authentication middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   └── server.js           # Main server file
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start MongoDB (if using local installation):
```bash
# Make sure MongoDB is running on localhost:27017
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
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

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Jobs
- `GET /api/jobs` - Get all jobs (with optional filters)
- `GET /api/jobs/:id` - Get specific job details
- `POST /api/jobs` - Create new job (employer only)
- `POST /api/jobs/:id/apply` - Apply for a job (jobseeker only)
- `GET /api/jobs/employer/my-jobs` - Get employer's posted jobs
- `PUT /api/jobs/application/status` - Update application status

### Resumes
- `POST /api/resumes/upload` - Upload resume (jobseeker only)
- `GET /api/resumes` - Get user's resumes
- `GET /api/resumes/:id/download` - Download resume
- `DELETE /api/resumes/:id` - Delete resume

## Usage

### For Jobseekers
1. Register as a "Jobseeker"
2. Upload your resume(s)
3. Browse available jobs
4. Apply to jobs using your uploaded resumes

### For Employers
1. Register as an "Employer"
2. Post job openings with detailed descriptions
3. View and manage applications
4. Update application status

## Demo Credentials

You can create test accounts or use these sample credentials:

**Jobseeker Account:**
- Email: jobseeker@demo.com
- Password: password123

**Employer Account:**
- Email: employer@demo.com
- Password: password123

## Features Demonstrated

✅ **Signup/Login (Jobseeker & Employer)**
- Separate registration flows for different user types
- Secure authentication with JWT tokens
- Form validation and error handling

✅ **Resume Upload Functionality**
- File upload with size and type validation
- Support for PDF and Word documents
- Resume management (upload, view, download, delete)

✅ **Basic Job Posting/Viewing**
- Comprehensive job posting form
- Advanced search and filtering
- Job details with application functionality
- Application tracking for employers

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- File upload validation and sanitization
- Role-based access control
- Input validation and sanitization

## Future Enhancements

- Email notifications
- Advanced search with AI
- Resume parsing and analysis
- Interview scheduling
- Real-time chat between employers and candidates
- Mobile application
- Analytics dashboard

## Contributing

This is a demo project for internship application. Feel free to use this as a starting point for your own job portal application.

## License

This project is open source and available under the MIT License. 