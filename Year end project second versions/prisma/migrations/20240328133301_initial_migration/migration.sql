/*
  Warnings:

  - You are about to drop the column `dislike` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `like` on the `Comment` table. All the data in the column will be lost.
  - The primary key for the `Hiking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `rating` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingAverage` to the `Hiking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_hikingId_fkey`;

-- AlterTable
ALTER TABLE `Comment` DROP COLUMN `dislike`,
    DROP COLUMN `like`,
    ADD COLUMN `rating` INTEGER NOT NULL,
    MODIFY `hikingId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Hiking` DROP PRIMARY KEY,
    ADD COLUMN `ratingAverage` DOUBLE NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `Favorite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `hikingId` VARCHAR(191) NOT NULL,

    INDEX `Favorite_userId_hikingId_idx`(`userId`, `hikingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_hikingId_fkey` FOREIGN KEY (`hikingId`) REFERENCES `Hiking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_hikingId_fkey` FOREIGN KEY (`hikingId`) REFERENCES `Hiking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
