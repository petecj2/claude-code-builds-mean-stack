# Vibe - MEAN Stack Movie Browser

A modern movie browsing application built with the MEAN stack (MongoDB, Express.js, Angular, Node.js) that provides an intuitive interface for exploring movies from the MongoDB Atlas sample_mflix database.

## 🎬 Features

- **Three-page Application Structure**
  - **Home Page**: Interactive alphabet grid showing available starting letters with movie counts
  - **Movies by Letter**: Paginated movie listings filtered by first letter (15 movies per page)
  - **Movie Detail**: Comprehensive movie information with cast, plot, ratings, and more

- **Modern UI/UX**
  - MongoDB.com inspired color scheme (green and dark theme)
  - Responsive design using Angular Material
  - Loading states and error handling
  - Smooth navigation between pages

- **Robust Backend API**
  - RESTful API with comprehensive error handling
  - Rate limiting and security middleware
  - MongoDB aggregation for optimized queries
  - Pagination support for large datasets

## 🛠️ Technology Stack

- **Frontend**: Angular 17 with Angular Material
- **Backend**: Node.js with Express.js
- **Database**: MongoDB Atlas (sample_mflix database)
- **Security**: Helmet.js, CORS, Rate limiting
- **Development**: TypeScript, SCSS for styling

## 📋 Prerequisites

Before running this application, ensure you have:

- Node.js (v18 or higher)
- npm (comes with Node.js)
- MongoDB Atlas account with access to sample_mflix database
- Angular CLI (install globally: `npm install -g @angular/cli`)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd vibe
```

### 2. Environment Configuration
Create a `.env` file in the root directory with your MongoDB connection string:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/

# Frontend URL (optional - defaults to localhost:4200)
FRONTEND_URL=http://localhost:4200

# Environment
NODE_ENV=development
```

⚠️ **IMPORTANT**: Never commit your `.env` file to version control. The file is already added to `.gitignore`.

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server (with auto-restart)
npm run dev

# Or start production server
npm start
```

The backend server will run on `http://localhost:3000`

### 4. Frontend Setup
```bash
# Navigate to frontend directory (from root)
cd frontend/movie-app

# Install dependencies
npm install

# Start development server
npm start

# Or use Angular CLI directly
ng serve
```

The frontend application will run on `http://localhost:4200`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. Get Alphabet Letters
```http
GET /api/movies/alphabet
```
Returns list of available first letters from movie titles.

**Response:**
```json
{
  "success": true,
  "data": ["A", "B", "C", ...],
  "message": "Alphabet list retrieved successfully"
}
```

#### 2. Get Movies by Letter
```http
GET /api/movies/by-letter/:letter?page=1
```
Returns paginated movies starting with specified letter (15 per page).

**Parameters:**
- `letter` (path): Single alphanumeric character
- `page` (query): Page number (default: 1)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "movie-id",
      "title": "Movie Title",
      "year": 2023,
      "genres": ["Action", "Drama"],
      "runtime": 120,
      "imdb": { "rating": 8.5, "votes": 10000 },
      "poster": "poster-url",
      "plot": "Movie plot...",
      "cast": ["Actor 1", "Actor 2"],
      "directors": ["Director Name"]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalCount": 150,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "message": "Movies starting with \"A\" retrieved successfully"
}
```

#### 3. Get Movie Details
```http
GET /api/movies/:id
```
Returns complete details for a specific movie.

**Parameters:**
- `id` (path): MongoDB ObjectId

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "movie-id",
    "title": "Complete Movie Title",
    "year": 2023,
    "plot": "Short plot",
    "fullplot": "Complete plot description",
    "genres": ["Genre1", "Genre2"],
    "runtime": 120,
    "cast": ["Actor 1", "Actor 2", "Actor 3"],
    "directors": ["Director 1"],
    "writers": ["Writer 1"],
    "imdb": {
      "rating": 8.5,
      "votes": 10000,
      "id": "imdb-id"
    },
    "poster": "poster-url",
    "countries": ["USA"],
    "languages": ["English"],
    "released": "2023-01-01T00:00:00.000Z",
    "rated": "PG-13",
    "awards": {
      "wins": 5,
      "nominations": 10,
      "text": "Won 5 awards..."
    }
  },
  "message": "Movie retrieved successfully"
}
```

#### 4. Search Movies (Bonus)
```http
GET /api/movies/search?q=search-term&page=1
```
Search movies by title, plot, genres, cast, or directors.

**Parameters:**
- `q` (query): Search term (minimum 2 characters)
- `page` (query): Page number (default: 1)

**Response:** Same structure as "Get Movies by Letter"

#### 5. Health Check
```http
GET /api/health
GET /api/status
```
Returns API health status.

## 🏗️ Project Structure

```
vibe/
├── backend/                 # Express.js API server
│   ├── config/
│   │   └── database.js      # MongoDB connection setup
│   ├── controllers/
│   │   └── movieController.js # Request handlers
│   ├── middleware/
│   │   ├── errorHandler.js  # Global error handling
│   │   └── requestLogger.js # Request logging
│   ├── models/
│   │   └── Movie.js         # MongoDB data layer
│   ├── routes/
│   │   ├── index.js         # Route aggregation
│   │   └── movieRoutes.js   # Movie-specific routes
│   ├── package.json
│   └── server.js            # Application entry point
│
├── frontend/movie-app/      # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── home/    # Home page component
│   │   │   │   ├── movie-detail/ # Movie detail page
│   │   │   │   └── movies-by-letter/ # Movie list page
│   │   │   ├── models/
│   │   │   │   └── movie.model.ts # TypeScript interfaces
│   │   │   ├── services/
│   │   │   │   └── movie.service.ts # HTTP service
│   │   │   ├── app.component.*  # Root component
│   │   │   ├── app.config.ts    # App configuration
│   │   │   └── app.routes.ts    # Routing setup
│   │   ├── assets/
│   │   │   └── images/
│   │   │       └── no-poster.svg # Default movie poster
│   │   └── styles.scss      # Global styles
│   ├── package.json
│   └── angular.json
│
├── .env                     # Environment variables (create this)
├── .gitignore
└── README.md               # This file
```

## 🎨 Design Features

- **MongoDB-inspired Color Scheme**: Professional green (#00684A) and dark backgrounds
- **Responsive Grid Layout**: Adapts to different screen sizes
- **Loading States**: Skeleton loaders and spinners for better UX
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Accessibility**: Proper ARIA labels and semantic HTML

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend/movie-app
ng serve     # Runs with live reload
```

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-restart

**Frontend:**
- `npm start` - Start development server (same as `ng serve`)
- `ng build` - Build for production
- `ng test` - Run unit tests

## 🚦 Testing

### Basic Functionality Testing

1. **Backend API Testing:**
   ```bash
   # Test health endpoint
   curl http://localhost:3000/api/health
   
   # Test alphabet endpoint
   curl http://localhost:3000/api/movies/alphabet
   
   # Test movies by letter
   curl "http://localhost:3000/api/movies/by-letter/A?page=1"
   ```

2. **Frontend Testing:**
   - Navigate to `http://localhost:4200`
   - Test alphabet grid navigation
   - Test pagination on movie lists
   - Test movie detail page navigation

## ⚠️ Important Security Notes

- **Never commit your `.env` file** - Contains sensitive MongoDB credentials
- **Rate limiting is enabled** - 1000 requests per 15-minute window per IP
- **CORS is configured** - Only allows requests from specified origins
- **Input validation** - All API endpoints validate input parameters
- **Error handling** - Sensitive information is not exposed in production

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Verify your `.env` file contains the correct `MONGODB_URI`
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Check that the connection string includes database credentials

2. **CORS Errors**
   - Ensure backend is running on port 3000
   - Verify frontend is running on port 4200
   - Check CORS configuration in `backend/server.js`

3. **Movies Not Loading**
   - Verify MongoDB connection is established
   - Check that you're connected to the `sample_mflix` database
   - Ensure the `movies` collection exists and has data

4. **Port Already in Use**
   - Backend: Change `PORT` in `.env` or kill process using port 3000
   - Frontend: Use `ng serve --port 4201` for different port

## 📝 API Response Examples

### Successful Response Format
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using the MEAN Stack**