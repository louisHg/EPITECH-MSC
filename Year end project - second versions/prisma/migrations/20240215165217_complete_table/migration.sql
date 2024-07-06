-- CreateTable
CREATE TABLE `Hiking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `area` VARCHAR(191) NOT NULL,
    `difficultyId` INTEGER NOT NULL,
    `distance` DOUBLE NOT NULL,
    `duration` DATETIME(3) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `bannerImg` VARCHAR(191) NULL,

    INDEX `Hiking_userId_difficultyId_idx`(`userId`, `difficultyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NULL,
    `hikingId` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `like` INTEGER NOT NULL DEFAULT 0,
    `dislike` INTEGER NOT NULL DEFAULT 0,

    INDEX `Comment_userId_hikingId_idx`(`userId`, `hikingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Hiking` ADD CONSTRAINT `Hiking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hiking` ADD CONSTRAINT `Hiking_difficultyId_fkey` FOREIGN KEY (`difficultyId`) REFERENCES `Difficulty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_hikingId_fkey` FOREIGN KEY (`hikingId`) REFERENCES `Hiking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
