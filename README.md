# School Management System

A complete, production-ready school management system with student, teacher, admin, and parent portals. Built with React, Node.js, Express, and MySQL.

## 🎯 Features

### Student Portal
- ✅ View marks and results
- ✅ Check attendance
- ✅ Submit assignments
- ✅ View timetable
- ✅ Real-time notifications
- ✅ Change password

### Teacher Portal
- ✅ Add and manage marks
- ✅ Track attendance
- ✅ View student submissions
- ✅ Generate reports
- ✅ Manage classes

### Admin Dashboard
- ✅ Manage students and teachers
- ✅ Pre-register students
- ✅ View system reports
- ✅ Financial management
- ✅ System settings
- ✅ User management

### Parent Portal
- ✅ View child's marks
- ✅ Check attendance
- ✅ View results
- ✅ Payment tracking
- ✅ Real-time notifications

### General Features
- ✅ Secure authentication
- ✅ Role-based access control
- ✅ Real-time notifications
- ✅ Responsive design (phone & PC)
- ✅ Cloudinary file uploads
- ✅ Database management
- ✅ Rate limiting
- ✅ Password encryption

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Lucide React** - Icons
- **jsPDF** - PDF generation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MySQL2** - Database
- **Cloudinary** - File storage
- **Multer** - File upload
- **bcryptjs** - Password hashing
- **JWT** - Authentication

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **Cloudinary** - File storage
- **PlanetScale/AWS RDS** - Database

---

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- MySQL 8.0+
- Cloudinary account (free)
- GitHub account
- Render account
- Vercel account

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/school-management-system.git
cd school-management-system
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create `.env` file:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
PORT=5000
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start backend:
```bash
npm start
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 📝 Default Credentials

### Admin
- Username: `admin`
- Password: `Admin@123`

### Teacher
- Username: `teacher1`
- Password: `Teacher@123`

### Student (hayu)
- Username: `hayu551`
- Password: `Hayu@123`

---

## 📁 Project Structure

```
school-management-system/
├── backend/
│   ├── config/
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   └── parentController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── parentAuthMiddleware.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── uploadRoutes.js
│   │   └── notificationRoutes.js
│   ├── .env
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CloudinaryUpload.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DirectorDashboard.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── database/
│   ├── schema.sql
│   └── migrations/
│
├── .gitignore
├── README.md
└── DEPLOYMENT_GUIDE.md
```

---

## 🗄️ Database Setup

### Create Database
```bash
mysql -u root -p
```

```sql
CREATE DATABASE school_management;
USE school_management;
```

### Import Schema
```bash
mysql -u root -p school_management < database/schema.sql
```

---

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ Secure file uploads

---

## 📱 Responsive Design

- ✅ Works on all devices
- ✅ Mobile-optimized
- ✅ Tablet-friendly
- ✅ Desktop-ready
- ✅ Touch-friendly buttons
- ✅ Flexible layouts

---

## 🚢 Deployment

### Deploy Backend on Render
1. Go to https://render.com
2. Connect GitHub repository
3. Create Web Service
4. Add environment variables
5. Deploy

### Deploy Frontend on Vercel
1. Go to https://vercel.com
2. Connect GitHub repository
3. Import project
4. Add environment variables
5. Deploy

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## 📚 Documentation

- `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `QUICK_DEPLOYMENT_STEPS.md` - Quick 15-minute deployment
- `CLOUDINARY_SETUP_GUIDE.md` - Cloudinary integration
- `PHONE_DISPLAYS_LIKE_PC.md` - Responsive design
- `NO_DUPLICATE_MARKS_SYSTEM.md` - Marks management

---

## 🐛 Troubleshooting

### Backend not connecting
1. Check MySQL is running
2. Verify database credentials
3. Check `.env` file
4. Review backend logs

### Frontend not loading
1. Check backend is running
2. Verify API URL
3. Check browser console
4. Clear cache

### Database error
1. Verify connection string
2. Check database exists
3. Run migrations
4. Check user permissions

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Commit with clear messages
5. Push to GitHub
6. Create Pull Request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👥 Support

For issues and questions:
1. Check documentation
2. Review GitHub issues
3. Create new issue with details
4. Include error messages and logs

---

## 🎓 Learning Resources

- React: https://react.dev
- Node.js: https://nodejs.org
- Express: https://expressjs.com
- MySQL: https://www.mysql.com
- Cloudinary: https://cloudinary.com

---

## 📊 Project Stats

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MySQL
- **File Storage**: Cloudinary
- **Deployment**: Render + Vercel
- **Lines of Code**: 5000+
- **Components**: 20+
- **API Endpoints**: 30+

---

## 🎉 Features Implemented

- ✅ Complete authentication system
- ✅ Role-based dashboards
- ✅ Real-time notifications
- ✅ File uploads (Cloudinary)
- ✅ Marks management
- ✅ Attendance tracking
- ✅ Payment management
- ✅ Report generation
- ✅ Responsive design
- ✅ Production-ready

---

## 📞 Contact

For questions or support, please create an issue on GitHub.

---

## 🙏 Acknowledgments

- React community
- Express.js community
- Cloudinary
- All contributors

---

**Made with ❤️ for education**

Last Updated: February 2026
