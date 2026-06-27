const express = require('express');
const { submitRating, updateRating, getStoreRatings, getUserRatings } = require('../controllers/ratingController');
const { createRatingValidator, updateRatingValidator } = require('../validators/ratingValidator');
const validate = require('../middlewares/validationMiddleware');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.post('/', createRatingValidator, validate, submitRating);
router.put('/:id', updateRatingValidator, validate, updateRating);
router.get('/store/:storeId', getStoreRatings);
router.get('/user', getUserRatings);

module.exports = router;
