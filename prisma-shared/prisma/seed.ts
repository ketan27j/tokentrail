import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      password: 'admin',
      name: 'admin',
    },
  })
  const bob = await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: {},
    create: {
      password: 'user',
      name: 'user',
      email: 'user@gmail.com',
    },
  })
  console.log({ alice, bob })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })