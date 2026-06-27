const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Clean up existing data
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password@123', salt);

  // 1. Create Admin (name must be 20-60 chars)
  const admin = await prisma.user.create({
    data: {
      name: 'Administrator User Account',
      email: 'admin@example.com',
      password: passwordHash,
      address: '123 Admin Street, Downtown City',
      role: 'ADMIN',
    },
  });

  // 2. Create 2 Store Owners
  const owners = [];
  for (let i = 1; i <= 2; i++) {
    const owner = await prisma.user.create({
      data: {
        name: `Store Owner Number ${i} Here`,
        email: `owner${i}@example.com`,
        password: passwordHash,
        address: `${i}00 Owner Avenue, Uptown City`,
        role: 'STORE_OWNER',
      },
    });
    owners.push(owner);
  }

  // 3. Create 10 Stores (5 per owner)
  const stores = [];
  for (let i = 1; i <= 10; i++) {
    const owner = owners[i % 2];
    const store = await prisma.store.create({
      data: {
        name: `Super Convenience Store Number ${i}`,
        email: `store${i}@example.com`,
        address: `${i}11 Store Lane, Market City`,
        ownerId: owner.id,
      },
    });
    stores.push(store);
  }

  // 4. Create 20 Normal Users
  const users = [];
  for (let i = 1; i <= 20; i++) {
    const user = await prisma.user.create({
      data: {
        name: `Normal Regular User Number ${i}`,
        email: `user${i}@example.com`,
        password: passwordHash,
        address: `${i}22 User Boulevard, Suburb City`,
        role: 'NORMAL_USER',
      },
    });
    users.push(user);
  }

  // 5. Create 100 Ratings (20 users × 5 stores)
  let ratingCount = 0;
  for (const user of users) {
    const storesToRate = stores.slice(0, 5);
    for (const store of storesToRate) {
      await prisma.rating.create({
        data: {
          userId: user.id,
          storeId: store.id,
          rating: Math.floor(Math.random() * 5) + 1,
        },
      });
      ratingCount++;
    }
  }

  console.log(`✅ Seeded: 1 Admin, ${owners.length} Store Owners, ${stores.length} Stores, ${users.length} Users, ${ratingCount} Ratings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
