const express = require('express');
const { register, login, changePassword } = require('../controllers/authController');
const { registerValidator, loginValidator, changePasswordValidator } = require('../validators/authValidator');
const validate = require('../middlewares/validationMiddleware');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.put('/change-password', verifyToken, changePasswordValidator, validate, changePassword);

module.exports = router;
