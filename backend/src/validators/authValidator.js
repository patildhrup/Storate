const { body } = require('express-validator');

// Name: Min 20, Max 60 chars.
// Email: Valid email.
// Password: 8-16 chars, at least one uppercase, at least one special character.
// Address: Max 400 chars.

const registerValidator = [
  body('name')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters'),
  body('email')
    .isEmail().withMessage('Must be a valid email'),
  body('password')
    .isString().withMessage('Password must be a string')
    .isLength({ min: 8, max: 16 }).withMessage('Password must be between 8 and 16 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
  body('address')
    .optional()
    .isString().withMessage('Address must be a string')
    .isLength({ max: 400 }).withMessage('Address maximum length is 400 characters'),
];

const loginValidator = [
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const changePasswordValidator = [
  body('oldPassword').notEmpty().withMessage('Old password is required'),
  body('newPassword')
    .isString().withMessage('New password must be a string')
    .isLength({ min: 8, max: 16 }).withMessage('New password must be between 8 and 16 characters')
    .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('New password must contain at least one special character'),
];

module.exports = {
  registerValidator,
  loginValidator,
  changePasswordValidator
};
