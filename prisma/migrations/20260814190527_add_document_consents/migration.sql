-- DropIndex
DROP INDEX `Anamnesis_studentId_fkey` ON `anamnesis`;

-- DropIndex
DROP INDEX `Attendance_classId_fkey` ON `attendance`;

-- DropIndex
DROP INDEX `Attendance_studentId_fkey` ON `attendance`;

-- DropIndex
DROP INDEX `Class_instructorId_fkey` ON `class`;

-- DropIndex
DROP INDEX `Enrollment_classId_fkey` ON `enrollment`;

-- DropIndex
DROP INDEX `Enrollment_studentId_fkey` ON `enrollment`;

-- DropIndex
DROP INDEX `GalleryPhoto_eventId_fkey` ON `galleryphoto`;

-- DropIndex
DROP INDEX `Payment_studentId_fkey` ON `payment`;

-- CreateTable
CREATE TABLE `DocumentConsent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `documentKey` VARCHAR(191) NOT NULL,
    `documentVersion` VARCHAR(191) NOT NULL,
    `acceptedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DocumentConsent_documentKey_idx`(`documentKey`),
    UNIQUE INDEX `DocumentConsent_studentId_documentKey_key`(`studentId`, `documentKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Class` ADD CONSTRAINT `Class_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `Instructor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Anamnesis` ADD CONSTRAINT `Anamnesis_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DanceEvaluation` ADD CONSTRAINT `DanceEvaluation_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GalleryPhoto` ADD CONSTRAINT `GalleryPhoto_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `GalleryEvent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentConsent` ADD CONSTRAINT `DocumentConsent_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StudentPlans` ADD CONSTRAINT `_StudentPlans_A_fkey` FOREIGN KEY (`A`) REFERENCES `Plan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StudentPlans` ADD CONSTRAINT `_StudentPlans_B_fkey` FOREIGN KEY (`B`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
