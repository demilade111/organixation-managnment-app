const asyncHandler = require('express-async-handler');
const {
  registrationSchema,
  loginSchema,
} = require('../utils/validationSchemas');
const { User, Organisation, sequelize } = require('../models');
const generateToken = require('../utils/generateToken');
const { UniqueConstraintError } = require('sequelize');

exports.register = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  console.log('Transaction started');

  try {
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      console.log('Validation error:', error.details);
      await transaction.rollback();
      return res.status(422).json({
        status: 'error',
        message: 'Invalid input',
        errors: error.details.map((detail) => ({
          field: detail.path[0],
          message: detail.message,
        })),
      });
    }

    const existingUser = await User.findOne({ where: { email: req.body.email } });
    if (existingUser) {
      console.log('Email already exists:', req.body.email);
      await transaction.rollback();
      return res.status(409).json({
        status: 'error',
        message: 'Email already exists',
      });
    }

    const user = await User.create(req.body, { transaction });
    console.log('User created:', user);

    // Create default organisation
    const organisationName = `${user.firstName}'s Organisation`;
    const organisation = await Organisation.create(
      {
        name: organisationName,
        description: `Default organisation for ${user.firstName} ${user.lastName}`,
      },
      { transaction }
    );
    console.log('Organisation created:', organisation);

    // Associate user with organisation
    await organisation.addUser(user, { transaction });
    console.log('User associated with organisation');

    await transaction.commit();
    console.log('Transaction committed');

    const token = generateToken(user);
    console.log('Token generated');

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (err) {
    console.error('Error during registration:', err);
    if (!transaction.finished) {
      await transaction.rollback();
    }
    next(err);
  }
});

exports.login = asyncHandler(async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      console.log('Validation error:', error.details);
      return res.status(422).json({
        status: 'error',
        message: 'Invalid input',
        errors: error.details.map((detail) => ({
          field: detail.path[0],
          message: detail.message,
        })),
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    console.log('User found:', user);

    if (!user || !(await user.validatePassword(password))) {
      console.log('Invalid email or password');
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user);
    console.log('Token generated');

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (err) {
    console.error('Error during login:', err);
    next(err);
  }
});
