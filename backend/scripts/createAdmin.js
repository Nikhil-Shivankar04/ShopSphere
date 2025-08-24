const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopSphere');
    
    // User model
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String
    }));

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('✅ Admin user already exists');
      console.log('Email: admin@example.com');
      console.log('You can reset password to: admin123 if needed');
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created successfully!');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();