import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AdminUser from '../models/AdminUser.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const adminExists = await AdminUser.findOne({ email: process.env.ADMIN_EMAIL });

    if (adminExists) {
      console.log('❌ Admin user already exists');
      process.exit();
    }

    // Create admin
    const admin = await AdminUser.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@vertexfinish.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'super-admin'
    });

    console.log('✅ Admin user created successfully');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log('⚠️  Please change the password after first login');

    process.exit();
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
