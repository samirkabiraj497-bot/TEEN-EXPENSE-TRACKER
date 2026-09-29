const UserModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { seedDemoDataForUser } = require('../services/seedService');

const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists. Please log in instead.'
        });
      }

      // Hash password securely with bcrypt
      const password_hash = await hashPassword(password);

      // Create user record in DB
      const user = await UserModel.create({
        name: name.trim(),
        email: email.trim(),
        password_hash
      });

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name
      });

      return res.status(201).json({
        success: true,
        message: 'Account created successfully! Welcome to TeenSpend.',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async guestLogin(req, res, next) {
    try {
      const crypto = require('crypto');
      const guestId = crypto.randomUUID().substring(0, 8);
      const name = `Guest ${guestId}`;
      const email = `guest_${guestId}@teenspend.local`;
      const password_hash = await hashPassword(crypto.randomUUID());

      const user = await UserModel.create({
        name,
        email,
        password_hash
      });

      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name
      });

      // Generate demo data automatically for the guest
      try {
        await seedDemoDataForUser(user.id);
      } catch (err) {
        console.error('Failed to seed demo data for guest', err);
      }

      return res.status(201).json({
        success: true,
        message: 'Logged in as guest!',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const isMatch = await comparePassword(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name
      });

      return res.status(200).json({
        success: true,
        message: 'Welcome back!',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User profile not found.'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async seedDemo(req, res, next) {
    try {
      const result = await seedDemoDataForUser(req.user.id);
      return res.status(201).json({
        success: true,
        message: `Successfully generated ${result.expensesCount} demo teen expenses and ${result.budgetsCount} budgets!`,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
