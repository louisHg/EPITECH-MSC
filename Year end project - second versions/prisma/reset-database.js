const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const resetTables = async () => {
  try {
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`;

    // Supprimer toutes les entrées de chaque table
    await prisma.account.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.difficulty.deleteMany({});
    await prisma.comment.deleteMany({});
    await prisma.hiking.deleteMany({});

    // Réinitialiser les identifiants à partir de 1 (pour MySQL)
    await prisma.$executeRaw`TRUNCATE TABLE Account`;
    await prisma.$executeRaw`TRUNCATE TABLE User`;
    await prisma.$executeRaw`TRUNCATE TABLE Difficulty`;
    await prisma.$executeRaw`TRUNCATE TABLE Comment`;
    await prisma.$executeRaw`TRUNCATE TABLE Hiking`;

    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`;

    console.log("Tables reset successfully.");
  } catch (error) {
    console.error("Error resetting tables:", error);
  } finally {
    await prisma.$disconnect();
  }
};

resetTables();
