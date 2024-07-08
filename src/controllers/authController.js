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

  try {
    const { error } = registrationSchema.validate(req.body);
    if (error) {
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

    const user = await User.create(req.body, { transaction });

    // Create default organisation
    const organisationName = `${user.firstName}'s Organisation`;
    const organisation = await Organisation.create(
      {
        name: organisationName,
        description: `Default organisation for ${user.firstName} ${user.lastName}`,
      },
      { transaction }
    );

    // Associate user with organisation
    await organisation.addUser(user, { transaction });

    await transaction.commit();

    const token = generateToken(user);

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
    await transaction.rollback();
    if (err instanceof UniqueConstraintError) {
      return res.status(409).json({
        status: 'error',
        message: 'Email already exists',
      });
    }
    next(err);
  }
});

exports.login = asyncHandler(async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
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

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user);

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
    next(err);
  }
});
