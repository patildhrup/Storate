const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
async function main() {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('User@1234', salt);
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Normal User',
      email: 'user@example.com',
      password: password,
      role: 'NORMAL_USER',
      address: 'User House'
    }
  });
  console.log('User created: user@example.com / User@1234');
}
main().catch(console.error).finally(() => prisma.$disconnect());
