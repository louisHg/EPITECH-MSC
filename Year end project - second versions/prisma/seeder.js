const { PrismaClient } = require("@prisma/client");

const { difficulties, hikings } = require("./data");

const prisma = new PrismaClient();

const load = async () => {
  try {
    difficulties.map(async (difficulty) => {
      const existingDifficulty = await prisma.difficulty.findUnique({
        where: {
          label: difficulty.label,
        },
      });

      if (!existingDifficulty) {
        await prisma.difficulty.create({
          data: difficulty,
        });
      }
    });

    // hikings.map(async (hiking) => {
    //   await prisma.hiking.create({
    //     data: hiking,
    //   });
    // });

    console.log("Data created.");
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
};

load();
