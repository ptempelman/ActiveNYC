const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteAllLikes() {
    await prisma.like.deleteMany({});
    console.log('All records in the Like table have been deleted.');
}

deleteAllLikes()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });