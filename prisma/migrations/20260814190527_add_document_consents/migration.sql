-- Idempotent migration: creates DocumentConsent with inline FK

CREATE TABLE IF NOT EXISTS `DocumentConsent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `documentKey` VARCHAR(191) NOT NULL,
    `documentVersion` VARCHAR(191) NOT NULL,
    `acceptedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DocumentConsent_documentKey_idx`(`documentKey`),
    UNIQUE INDEX `DocumentConsent_studentId_documentKey_key`(`studentId`, `documentKey`),
    PRIMARY KEY (`id`),
    CONSTRAINT `DocumentConsent_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
