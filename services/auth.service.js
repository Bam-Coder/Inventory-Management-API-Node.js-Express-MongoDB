// services/auth.service.js
// Service métier pour l'authentification et la gestion des utilisateurs

const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

const registerUser = async (data) => {
  const { name, email, password, businessName } = data;
  const userExists = await User.findOne({ email });
  if (userExists) return { error: 'user_exists' };
  const user = await User.create({ name, email, password, businessName });
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    businessName: user.businessName,
    role: user.role,
    token: generateToken(user),
  };
};

async function comparePassword(enteredPassword, hashedPassword) {
  return await bcrypt.compare(enteredPassword, hashedPassword);
}

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) return { error: 'invalid_credentials' };
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) return { error: 'invalid_credentials' };
  if (user.isDeleted) return { error: 'deactivated' };
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    businessName: user.businessName,
    role: user.role,
    token: generateToken(user),
  };
};

const getMyProfile = async (userId) => {
  return await User.findById(userId).select('-password');
};

const updateMyProfile = async (userId, data) => {
  const { name, email, businessName } = data;
  const user = await User.findById(userId);
  if (!user) return { error: 'not_found' };
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
    if (emailExists) return { error: 'email_exists' };
  }
  if (name) user.name = name;
  if (email) user.email = email;
  if (businessName) user.businessName = businessName;
  await user.save();
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    businessName: user.businessName,
    role: user.role,
  };
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) return { error: 'not_found' };
  const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
  if (!isCurrentPasswordValid) return { error: 'invalid_current_password' };
  user.password = newPassword;
  await user.save();
  return true;
}; 

module.exports = {
  registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
  changePassword,
};