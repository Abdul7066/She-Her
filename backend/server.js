const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ override: true });

const app = express();
const PORT = 4001; // ✅ Forced port to 4001 to stop EADDRINUSE conflicts during demo

// ✅ 1. Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false, // disable CSP in dev to avoid image blocking
}));

// ✅ 2. Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ✅ 3. Rate Limiting for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/auth', authLimiter);

// ✅ 4. Body Parsers
// NOTE: raw body parser is used IN the paymentRoutes for /webhook
app.use(cors());
app.use(express.json());

// Serve uploaded product images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Imports
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/she_and_her";
mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB connection established successfully"))
  .catch(err => console.log("❌ MongoDB connection failed:", err.message));

// Base Route
app.get('/', (req, res) => {
  res.send('She and Her E-commerce Backend is running');
});

// ✅ 5. 404 Catch-all
app.use((req, res, next) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// ✅ 6. Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server
const { verifyEmailConfig } = require('./utils/sendEmail');
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
  verifyEmailConfig(); // Check email config on startup
});
