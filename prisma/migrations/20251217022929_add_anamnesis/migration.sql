/*
  Warnings:

  - You are about to drop the `_ClassAttendances` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `_ClassAttendances`;

-- CreateTable
CREATE TABLE `Anamnesis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `age` INTEGER NULL,
    `contact` VARCHAR(191) NOT NULL,
    `weightKg` DOUBLE NULL,
    `heightM` DOUBLE NULL,
    `injuries` VARCHAR(191) NULL,
    `chronicDiseases` VARCHAR(191) NULL,
    `allergies` VARCHAR(191) NULL,
    `medications` VARCHAR(191) NULL,
    `surgeries` VARCHAR(191) NULL,
    `activityDaysPerWeek` INTEGER NULL,
    `activityType` VARCHAR(191) NULL,
    `sessionDurationMinutes` INTEGER NULL,
    `consentAccepted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- AddForeignKey
ALTER TABLE `Anamnesis` ADD CONSTRAINT `Anamnesis_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
