const { body } = require('express-validator');

const createRatingValidator = [
  body('storeId').isUUID().withMessage('Valid Store ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
];

const updateRatingValidator = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
];

module.exports = {
  createRatingValidator,
  updateRatingValidator,
};
