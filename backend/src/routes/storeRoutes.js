const express = require('express');
const { getStores, getStoreById, createStore, updateStore, deleteStore } = require('../controllers/storeController');
const { createStoreValidator, updateStoreValidator } = require('../validators/storeValidator');
const validate = require('../middlewares/validationMiddleware');
const { verifyToken, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyToken);

// Accessible by ADMIN, STORE_OWNER, NORMAL_USER
router.get('/', getStores);
router.get('/:id', getStoreById);

// Accessible by ADMIN only
router.post('/', restrictTo('ADMIN'), createStoreValidator, validate, createStore);
router.put('/:id', restrictTo('ADMIN'), updateStoreValidator, validate, updateStore);
router.delete('/:id', restrictTo('ADMIN'), deleteStore);

module.exports = router;
