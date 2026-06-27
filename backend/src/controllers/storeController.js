const prisma = require('../utils/prismaClient');

const calculateAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
  return parseFloat((sum / ratings.length).toFixed(1));
};

const getStores = async (req, res, next) => {
  try {
    const { search, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10, myStores } = req.query;
    
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // For STORE_OWNER dashboard
    if (myStores === 'true' && req.user.role === 'STORE_OWNER') {
      where.ownerId = req.user.id;
    }

    const orderBy = {};
    if (['name', 'email', 'address', 'createdAt'].includes(sortBy)) {
      orderBy[sortBy] = order === 'asc' ? 'asc' : 'desc';
    } else if (sortBy !== 'averageRating') {
      orderBy.createdAt = 'desc';
    }

    const total = await prisma.store.count({ where });
    let storesData = await prisma.store.findMany({
      where,
      orderBy: sortBy !== 'averageRating' ? orderBy : undefined,
      skip: sortBy !== 'averageRating' ? (parseInt(page) - 1) * parseInt(limit) : undefined,
      take: sortBy !== 'averageRating' ? parseInt(limit) : undefined,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        ratings: { select: { id: true, rating: true, userId: true } }
      }
    });

    let stores = storesData.map(store => {
      const { ratings, ...rest } = store;
      
      let userRating = null;
      let userRatingId = null;
      if (req.user) {
        const ur = ratings.find(r => r.userId === req.user.id);
        if (ur) {
          userRating = ur.rating;
          userRatingId = ur.id;
        }
      }

      return {
        ...rest,
        averageRating: calculateAverageRating(ratings),
        totalRatings: ratings.length,
        userRating,
        userRatingId
      };
    });

    // In-memory sort for averageRating since it's a computed field
    if (sortBy === 'averageRating') {
      stores.sort((a, b) => order === 'asc' ? a.averageRating - b.averageRating : b.averageRating - a.averageRating);
      // Manual pagination
      stores = stores.slice((parseInt(page) - 1) * parseInt(limit), parseInt(page) * parseInt(limit));
    }

    res.status(200).json({ success: true, total, stores });
  } catch (error) {
    next(error);
  }
};

const getStoreById = async (req, res, next) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: req.params.id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        ratings: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });
    
    if (!store) return res.status(404).json({ success: false, message: 'Store not found' });

    const { ratings, ...rest } = store;
    res.status(200).json({ 
      success: true, 
      store: {
        ...rest,
        averageRating: calculateAverageRating(ratings),
        totalRatings: ratings.length,
        ratings 
      } 
    });
  } catch (error) {
    next(error);
  }
};

const createStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const owner = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ success: false, message: 'Owner not found' });
    if (owner.role !== 'STORE_OWNER') {
      await prisma.user.update({ where: { id: ownerId }, data: { role: 'STORE_OWNER' }});
    }

    const store = await prisma.store.create({
      data: { name, email, address, ownerId }
    });

    res.status(201).json({ success: true, store });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Store email must be unique' });
    }
    next(error);
  }
};

const updateStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;
    
    if (ownerId) {
      const owner = await prisma.user.findUnique({ where: { id: ownerId } });
      if (!owner) return res.status(404).json({ success: false, message: 'Owner not found' });
      if (owner.role !== 'STORE_OWNER') {
        await prisma.user.update({ where: { id: ownerId }, data: { role: 'STORE_OWNER' }});
      }
    }

    const store = await prisma.store.update({
      where: { id: req.params.id },
      data: { name, email, address, ownerId }
    });

    res.status(200).json({ success: true, store });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Store not found' });
    if (error.code === 'P2002') return res.status(400).json({ success: false, message: 'Store email must be unique' });
    next(error);
  }
};

const deleteStore = async (req, res, next) => {
  try {
    await prisma.store.delete({ where: { id: req.params.id } });
    res.status(200).json({ success: true, message: 'Store deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Store not found' });
    next(error);
  }
};

module.exports = { getStores, getStoreById, createStore, updateStore, deleteStore };
