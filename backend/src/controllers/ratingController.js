const prisma = require('../utils/prismaClient');

const submitRating = async (req, res, next) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    // Check if store exists
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    // Upsert rating (creates if not exists, updates if exists)
    // The prompt says: "If user submits again, update existing rating."
    const upsertedRating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      update: {
        rating,
      },
      create: {
        userId,
        storeId,
        rating,
      },
    });

    res.status(200).json({ success: true, rating: upsertedRating });
  } catch (error) {
    next(error);
  }
};

const updateRating = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const userId = req.user.id;

    const existingRating = await prisma.rating.findUnique({ where: { id: req.params.id } });
    if (!existingRating) {
      return res.status(404).json({ success: false, message: 'Rating not found' });
    }

    // Ensure the rating belongs to the user
    if (existingRating.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this rating' });
    }

    const updatedRating = await prisma.rating.update({
      where: { id: req.params.id },
      data: { rating },
    });

    res.status(200).json({ success: true, rating: updatedRating });
  } catch (error) {
    next(error);
  }
};

const getStoreRatings = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) return res.status(404).json({ success: false, message: 'Store not found' });

    const ratings = await prisma.rating.findMany({
      where: { storeId },
      include: {
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, ratings });
  } catch (error) {
    next(error);
  }
};

const getUserRatings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const ratings = await prisma.rating.findMany({
      where: { userId },
      include: {
        store: { select: { id: true, name: true, address: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, ratings });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitRating, updateRating, getStoreRatings, getUserRatings };
