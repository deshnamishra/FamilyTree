require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const familyRoutes = require('./routes/familyRoutes');
const treeRoutes = require('./routes/treeRoutes');
const cors = require('cors');

const { logRequests } = require('./middleware/logRequests');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

connectDB().catch(err => {
  console.error('❌ Database connection failed:', err);
  process.exit(1);
});

app.use(helmet());
app.disable('x-powered-by');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 200,
  message: 'Too many requests from this IP, please try again later',
});
app.use(limiter);

// CORS config — fixed
const allowedOrigins = [
  process.env.CLIENT_URL,
  ...(process.env.LOCAL_URLS ? process.env.LOCAL_URLS.split(',') : []),
].filter(Boolean);

const corsOptions = {
  origin: allowedOrigins.length > 0 ? allowedOrigins : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(logRequests);

// API Routes
app.use('/api/family', familyRoutes);
app.use('/api/trees', treeRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Error Handler
app.use(errorHandler);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});