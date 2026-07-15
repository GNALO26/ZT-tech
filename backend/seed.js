require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await User.deleteMany({});
    await User.create({
      email: process.env.ADMIN_EMAIL || 'admin@zttechnologies.bj',
      password_hash: process.env.ADMIN_PASSWORD || 'MotDePasseAdmin123!',
    });
    console.log('✅ Compte admin créé');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });