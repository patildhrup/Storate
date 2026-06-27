const { body } = require('express-validator');

const userValidator = [
  body('name').isString().isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters'),
  body('email').isEmail().withMessage('Must be a valid email'),
  body('address').optional().isString().isLength({ max: 400 }).withMessage('Address maximum length is 400 characters'),
  body('role').optional().isIn(['ADMIN', 'NORMAL_USER', 'STORE_OWNER']).withMessage('Invalid role'),
];

const createUserValidator = [
  ...userValidator,
  body('password')
    .isString().withMessage('Password must be a string')
    .isLength({ min: 8, max: 16 }).withMessage('Password must be between 8 and 16 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
];

module.exports = {
  createUserValidator,
  userValidator
};
