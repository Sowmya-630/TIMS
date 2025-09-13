import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Register new user
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const userData = {
      fullName,
      email,
      password,
      role: role || 'EndUser'
    };

    const user = await User.create(userData);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    res.status(201).json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isMatch = await user.verifyPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    res.json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin only)
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const users = await User.findAll(page, limit, search);
    const total = await User.count(search);

    res.json({
      users: users.map(user => user.toJSON()),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Users can only view their own profile, admins can view any
    if (req.user.role === 'EndUser' && req.user.id !== user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Users can only update their own profile, admins can update any
    if (req.user.role === 'EndUser' && req.user.id !== user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Prevent EndUsers from changing their role
    if (req.user.role === 'EndUser' && req.body.role) {
      delete req.body.role;
    }

    const updatedUser = await user.update(req.body);
    res.json(updatedUser.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.verifyPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    await user.updatePassword(newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's subscriptions
export const getUserSubscriptions = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Users can only view their own subscriptions, admins can view any
    if (req.user.role === 'EndUser' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const status = req.query.status || null;
    const subscriptions = await user.getSubscriptions(status);
    
    res.json(subscriptions.map(sub => sub.toJSON()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.delete();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};