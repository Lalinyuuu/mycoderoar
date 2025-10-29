# MyCodeRoar - Modern Blog Platform

A full-stack blog platform built with React, Node.js, and modern web technologies. Features include user authentication, post management, real-time interactions, AI-powered chatbot, and comprehensive admin dashboard.

## 🚀 Features

### Core Features
- **User Authentication & Authorization** - Secure login/register with JWT tokens
- **Blog Post Management** - Create, edit, delete, and publish blog posts
- **Real-time Interactions** - Like, comment, save, and share posts
- **Follow System** - Follow users and personalized feed
- **AI Chatbot (Kafra)** - Powered by Gemini AI for user assistance
- **Admin Dashboard** - Comprehensive management interface
- **Statistics & Analytics** - User engagement and post performance metrics
- **Responsive Design** - Mobile-first approach with modern UI

### Technical Features
- **Performance Optimized** - Lazy loading, memoization, and efficient rendering
- **Error Handling** - Comprehensive error boundaries and fallback mechanisms
- **Real-time Updates** - Live notifications and data synchronization
- **Image Management** - Cloudinary integration for image uploads
- **Search & Filtering** - Advanced post search and category filtering
- **Export Functionality** - Data export capabilities for admin users

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Zustand** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notifications
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **Cloudinary** - Image storage and optimization

### AI & External Services
- **Google Gemini AI** - Chatbot intelligence
- **OpenAI API** - Alternative AI service
- **Cloudinary** - Image management
- **Sentry** - Error tracking (optional)

## 📁 Project Structure

```
mycoderoar/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── admin/          # Admin-specific components
│   │   ├── cards/          # Post and content cards
│   │   ├── chat/           # Chatbot components
│   │   ├── follow/         # Follow system components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # Basic UI components
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── auth/           # Authentication pages
│   │   ├── follow/         # Follow feed pages
│   │   └── post/           # Post viewing pages
│   ├── services/           # API and external services
│   ├── hooks/              # Custom React hooks
│   ├── contexts/           # React contexts
│   ├── stores/             # State management
│   └── utils/              # Utility functions
├── blog-api/               # Backend API server
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   └── utils/          # Backend utilities
│   └── prisma/             # Database schema and migrations
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Cloudinary account (for image uploads)
- Google Gemini API key (for chatbot)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mycoderoar
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd blog-api
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/mycoderoar"
   
   # JWT
   JWT_SECRET="your-jwt-secret"
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   
   # AI Services
   GEMINI_API_KEY="your-gemini-key"
   OPENAI_API_KEY="your-openai-key"
   ```

   Create `.env` file in `blog-api` directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/mycoderoar"
   JWT_SECRET="your-jwt-secret"
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

5. **Database Setup**
   ```bash
   cd blog-api
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

6. **Start Development Servers**
   
   Backend (Terminal 1):
   ```bash
   cd blog-api
   npm run dev
   ```
   
   Frontend (Terminal 2):
   ```bash
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Admin Dashboard: http://localhost:5173/admin

## 📱 Usage

### For Regular Users
1. **Register/Login** - Create an account or sign in
2. **Browse Posts** - Explore the main feed or follow feed
3. **Interact** - Like, comment, save, and share posts
4. **Follow Users** - Follow interesting authors
5. **Chat with Kafra** - Use the AI chatbot for assistance

### For Admin Users
1. **Access Admin Dashboard** - Navigate to `/admin`
2. **Manage Posts** - Create, edit, and publish blog posts
3. **User Management** - View and manage user accounts
4. **Analytics** - Monitor platform statistics and performance
5. **Content Moderation** - Manage comments and interactions

## 🔧 Available Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run db:push      # Push database schema changes
npm run db:seed      # Seed database with sample data
```

## 🎨 Key Components

### Admin Dashboard
- **Post Management** - Full CRUD operations for blog posts
- **User Analytics** - User engagement and activity metrics
- **Content Statistics** - Post performance and category analysis
- **Real-time Updates** - Live data synchronization

### AI Chatbot (Kafra)
- **Intelligent Responses** - Powered by Google Gemini AI
- **Context Awareness** - Maintains conversation context
- **Rate Limiting** - Prevents API abuse
- **Fallback Responses** - Graceful degradation when AI is unavailable

### Follow System
- **Personalized Feed** - Custom feed based on followed users
- **Follow Management** - Easy follow/unfollow functionality
- **Activity Tracking** - Monitor user interactions and engagement

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Comprehensive data validation
- **Rate Limiting** - API rate limiting to prevent abuse
- **Error Handling** - Secure error messages without sensitive data
- **CORS Configuration** - Proper cross-origin resource sharing

## 📊 Performance Optimizations

- **Lazy Loading** - Components loaded on demand
- **Memoization** - React.memo and useMemo for optimization
- **Image Optimization** - Cloudinary integration for efficient images
- **Code Splitting** - Dynamic imports for better bundle size
- **Caching** - Intelligent caching strategies

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Run `npx prisma db push`

2. **Image Upload Issues**
   - Verify Cloudinary credentials
   - Check CLOUDINARY_* environment variables

3. **AI Chatbot Not Working**
   - Verify GEMINI_API_KEY is set
   - Check API quota and limits
   - Ensure backend server is running

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check for TypeScript/ESLint errors
   - Verify all environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Vite Team** - For the fast build tool
- **Tailwind CSS** - For the utility-first CSS framework
- **Google Gemini** - For AI capabilities
- **Cloudinary** - For image management services

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ by the MyCodeRoar **