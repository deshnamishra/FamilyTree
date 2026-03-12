require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const familyRoutes = require('./routes/familyRoutes');
const treeRoutes = require('./routes/treeRoutes'); // ✅ NEW: Tree management
const cors = require('cors');
const path = require('path');

// Middleware
const { logRequests } = require('./middleware/logRequests');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB().catch(err => {
  console.error('❌ Database connection failed:', err);
  process.exit(1);
});

// Security headers
app.use(helmet());
app.disable('x-powered-by');

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 200,
  message: 'Too many requests from this IP, please try again later',
});
app.use(limiter);

// CORS config
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_URL 
      ? [process.env.PRODUCTION_URL]
      : false
    : process.env.LOCAL_URLS
      ? process.env.LOCAL_URLS.split(',')
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

if (corsOptions.origin !== false) {
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
} else {
  console.warn('⚠️  CORS is disabled — no valid origins configured');
}

// Parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging
app.use(logRequests);

// Static frontend (production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// API Routes
app.use('/api/family', familyRoutes);     // Existing: manage family members
app.use('/api/trees', treeRoutes);       // ✅ New: manage family trees

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error Handler
app.use(errorHandler);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
  });
});

// Server start
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful shutdowns
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});
