const { body } = require('express-validator');

const createStoreValidator = [
  body('name').isString().withMessage('Name is required').isLength({ min: 3, max: 60 }),
  body('email').isEmail().withMessage('Must be a valid email'),
  body('address').isString().withMessage('Address is required').isLength({ max: 400 }),
  body('ownerId').isUUID().withMessage('ownerId must be a valid user UUID'),
];

const updateStoreValidator = [
  body('name').optional().isString().isLength({ min: 3, max: 60 }),
  body('email').optional().isEmail(),
  body('address').optional().isString().isLength({ max: 400 }),
  body('ownerId').optional().isUUID(),
];

module.exports = {
  createStoreValidator,
  updateStoreValidator,
};
