/*
  Warnings:

  - You are about to drop the column `date` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Hiking` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Hiking` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Hiking` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Hiking` table. All the data in the column will be lost.
  - Added the required column `title` to the `Hiking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Comment` DROP COLUMN `date`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Hiking` DROP COLUMN `duration`,
    DROP COLUMN `latitude`,
    DROP COLUMN `longitude`,
    DROP COLUMN `name`,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    MODIFY `distance` DOUBLE NULL,
    MODIFY `ratingAverage` DOUBLE NULL DEFAULT 0.0;

-- CreateTable
CREATE TABLE `TravelPoint` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `hikingId` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TravelPoint` ADD CONSTRAINT `TravelPoint_hikingId_fkey` FOREIGN KEY (`hikingId`) REFERENCES `Hiking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
