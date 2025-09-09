const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require('./routes/auth');
const prodRoutes = require('./routes/products');

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors({
    origin: 'http://localhost:5173', // React app URL
    credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.Users_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', prodRoutes);


// Example protected route
const authMiddleware = require('./middleware/auth');
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({
        message: `Hello, user ${req.user.id}. You are authenticated.`,
        role: req.user.role
    });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
