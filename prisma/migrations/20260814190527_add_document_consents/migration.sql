-- Idempotent migration: only adds DocumentConsent table and its FK

-- CreateTable
CREATE TABLE IF NOT EXISTS `DocumentConsent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `documentKey` VARCHAR(191) NOT NULL,
    `documentVersion` VARCHAR(191) NOT NULL,
    `acceptedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DocumentConsent_documentKey_idx`(`documentKey`),
    UNIQUE INDEX `DocumentConsent_studentId_documentKey_key`(`studentId`, `documentKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey: DocumentConsent_studentId_fkey
SET @s=(SELECT IF(COUNT(*)=0,'ALTER TABLE `DocumentConsent` ADD CONSTRAINT `DocumentConsent_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE','DO 1') FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='DocumentConsent' AND CONSTRAINT_NAME='DocumentConsent_studentId_fkey' AND CONSTRAINT_TYPE='FOREIGN KEY');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;
