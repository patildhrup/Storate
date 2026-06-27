const prisma = require('../utils/prismaClient');

const getAdminDashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStores,
        totalRatings,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminDashboard };
