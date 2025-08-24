const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Add this line

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://shopsphere-ik8z.onrender.com/', // Your frontend URL
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// Serve React app for all other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));