const bcrypt = require('bcrypt');
const prisma = require('../utils/prismaClient');

const getUsers = async (req, res, next) => {
  try {
    const { search, role, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
    
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) {
      where.role = role;
    }

    const orderBy = {};
    if (['name', 'email', 'role', 'createdAt'].includes(sortBy)) {
      orderBy[sortBy] = order === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const total = await prisma.user.count({ where });
    const usersData = await prisma.user.findMany({
      where,
      orderBy,
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        stores: {
          select: {
            ratings: { select: { rating: true } }
          }
        }
      },
    });

    const users = usersData.map(user => {
      let ownerAverageRating = null;
      if (user.role === 'STORE_OWNER') {
        let totalRatings = 0;
        let sumRatings = 0;
        user.stores.forEach(store => {
          store.ratings.forEach(r => {
            totalRatings++;
            sumRatings += r.rating;
          });
        });
        ownerAverageRating = totalRatings > 0 ? parseFloat((sumRatings / totalRatings).toFixed(1)) : 0;
      }
      
      const { stores, ...rest } = user;
      return {
        ...rest,
        ...(ownerAverageRating !== null && { averageRating: ownerAverageRating })
      };
    });

    res.status(200).json({ success: true, total, users });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;
    
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ success: false, message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, address, role: role || 'NORMAL_USER' },
      select: { id: true, name: true, email: true, role: true }
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email, address, role } = req.body;
    
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, email, address, role },
      select: { id: true, name: true, email: true, address: true, role: true }
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    next(error);
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
