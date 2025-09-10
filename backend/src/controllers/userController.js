import { User } from '../models/User.js';
import logger from '../config/logger.js';

// Get all users
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const users = await User.findAll(page, limit, search);
    const total = await User.count(search);
    const totalPages = Math.ceil(total / limit);

    res.json({
      users: users.map(user => user.toJSON()),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: user.toJSON()
    });
  } catch (error) {
    logger.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new user
export const createUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const user = await User.create({ fullName, email, password, role });
    
    logger.info(`New user created: ${email} with role: ${role} by ${req.user.email}`);
    
    res.status(201).json({
      message: 'User created successfully',
      user: user.toJSON()
    });
  } catch (error) {
    logger.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    const updatedUser = await user.update({ fullName, email, role });
    
    logger.info(`User updated: ${user.email} by ${req.user.email}`);
    
    res.json({
      message: 'User updated successfully',
      user: updatedUser.toJSON()
    });
  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.delete();
    
    logger.info(`User deleted: ${user.email} by ${req.user.email}`);
    
    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get users by role
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await User.findByRole(role);
    
    res.json({
      users: users.map(user => user.toJSON())
    });
  } catch (error) {
    logger.error('Get users by role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user statistics
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const adminCount = await User.count('Admin');
    const managerCount = await User.count('Manager');
    const staffCount = await User.count('Staff');

    res.json({
      totalUsers,
      adminCount,
      managerCount,
      staffCount
    });
  } catch (error) {
    logger.error('Get user stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
