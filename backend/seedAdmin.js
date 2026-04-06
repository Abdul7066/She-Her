const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/she_and_her';

mongoose.connect(uri).then(() => console.log('MongoDB connected'));

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existing = await User.findOne({ email: 'admin@sheandher.com' });
    if (existing) {
      console.log('⚠️  Admin already exists:', existing.email);
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@sheandher.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true, // Admin accounts are pre-verified
    });

    console.log('✅ Admin created!');
    console.log('   Email   :', admin.email);
    console.log('   Password: Admin@123');
    console.log('   Role    :', admin.role);
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

seedAdmin();
