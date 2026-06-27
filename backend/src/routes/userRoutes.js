const express = require('express');
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { createUserValidator, userValidator } = require('../validators/userValidator');
const validate = require('../middlewares/validationMiddleware');
const { verifyToken, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyToken);
router.use(restrictTo('ADMIN'));

router.route('/')
  .get(getUsers)
  .post(createUserValidator, validate, createUser);

router.route('/:id')
  .get(getUserById)
  .put(userValidator, validate, updateUser)
  .delete(deleteUser);

module.exports = router;
