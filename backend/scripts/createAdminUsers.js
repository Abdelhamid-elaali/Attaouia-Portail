require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user
    const adminUser = new User({
      email: 'admin@attaouia.ma',
      password: 'Admin@2025',
      role: 'admin',
      fullName: 'Administrateur Principal'
    });
    await adminUser.save();
    console.log('Admin user created successfully');

    // Create supervisor user
    const supervisorUser = new User({
      email: 'superviseur@attaouia.ma',
      password: 'Super@2025',
      role: 'superviseur',
      fullName: 'Superviseur Principal'
    });
    await supervisorUser.save();
    console.log('Supervisor user created successfully');

    console.log('\nInitial users created:');
    console.log('Admin Email: admin@attaouia.ma');
    console.log('Admin Password: Admin@2025');
    console.log('\nSupervisor Email: superviseur@attaouia.ma');
    console.log('Supervisor Password: Super@2025');

  } catch (error) {
    console.error('Error creating users:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createUsers();
