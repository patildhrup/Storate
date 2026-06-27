const express = require('express');
const { getAdminDashboard } = require('../controllers/dashboardController');
const { verifyToken, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/admin', verifyToken, restrictTo('ADMIN'), getAdminDashboard);

module.exports = router;
