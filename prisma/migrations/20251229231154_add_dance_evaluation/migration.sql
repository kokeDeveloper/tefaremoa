-- CreateTable
CREATE TABLE `DanceEvaluation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `evaluationDate` DATE NOT NULL,
    `modality` ENUM('INDIVIDUAL', 'PAIR') NOT NULL DEFAULT 'INDIVIDUAL',
    `partnerName` VARCHAR(191) NULL,
    `rubricSequences` JSON NOT NULL,
    `rubricChoreo` JSON NOT NULL,
    `observations` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DanceEvaluation_evaluationDate_idx`(`evaluationDate`),
    UNIQUE INDEX `DanceEvaluation_studentId_evaluationDate_key`(`studentId`, `evaluationDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DanceEvaluation` ADD CONSTRAINT `DanceEvaluation_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
