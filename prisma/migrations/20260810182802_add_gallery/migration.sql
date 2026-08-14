-- Idempotent migration: checks existence via information_schema before each DROP/ADD

-- DropForeignKey: Anamnesis_studentId_fkey
SET @s=(SELECT IF(COUNT(*)>0,'ALTER TABLE `Anamnesis` DROP FOREIGN KEY `Anamnesis_studentId_fkey`','DO 1') FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Anamnesis' AND CONSTRAINT_NAME='Anamnesis_studentId_fkey' AND CONSTRAINT_TYPE='FOREIGN KEY');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- DropForeignKey: Attendance_classId_fkey
SET @s=(SELECT IF(COUNT(*)>0,'ALTER TABLE `Attendance` DROP FOREIGN KEY `Attendance_classId_fkey`','DO 1') FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Attendance' AND CONSTRAINT_NAME='Attendance_classId_fkey' AND CONSTRAINT_TYPE='FOREIGN KEY');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- DropForeignKey: Attendance_studentId_fkey
SET @s=(SELECT IF(COUNT(*)>0,'ALTER TABLE `Attendance` DROP FOREIGN KEY `Attendance_studentId_fkey`','DO 1') FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Attendance' AND CONSTRAINT_NAME='Attendance_studentId_fkey' AND CONSTRAINT_TYPE='FOREIGN KEY');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- DropForeignKey: Class_instructorId_fkey
SET @s=(SELECT IF(COUNT(*)>0,'ALTER TABLE `Class` DROP FOREIGN KEY `Class_instructorId_fkey`','DO 1') FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Class' AND CONSTRAINT_NAME='Class_instructorId_fkey' AND CONSTRAINT_TYPE='FOREIGN KEY');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- DropForeignKey: Enrollment_classId_fkey
SET @s=(SELECT IF(COUNT(*)>0,'ALTER TABLE `Enrollment` DROP FOREIGN KEY `Enrollment_classId_fkey`','DO 1') FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Enrollment' AND CONSTRAINT_NAME='Enrollment_classId_fkey' AND CONSTRAINT_TYPE='FOREIGN KEY');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- DropForeignKey: Enrollment_studentId_fkey
SET @s=(SELECT IF(COUNT(*)>0,'ALTER TABLE `Enrollment` DROP FOREIGN KEY `Enrollment_studentId_fkey`','DO 1') FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Enrollment' AND CONSTRAINT_NAME='Enrollment_studentId_fkey' AND CONSTRAINT_TYPE='FOREIGN KEY');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- DropForeignKey: Payment_studentId_fkey
SET @s=(SELECT IF(COUNT(*)>0,'ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_studentId_fkey`','DO 1') FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Payment' AND CONSTRAINT_NAME='Payment_studentId_fkey' AND CONSTRAINT_TYPE='FOREIGN KEY');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- DropIndex: Anamnesis_studentId_fkey
SET @s=(SELECT IF(COUNT(*)>0,'DROP INDEX `Anamnesis_studentId_fkey` ON `Anamnesis`','DO 1') FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Anamnesis' AND INDEX_NAME='Anamnesis_studentId_fkey');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- DropIndex: Attendance_classId_fkey
SET @s=(SELECT IF(COUNT(*)>0,'DROP INDEX `Attendance_classId_fkey` ON `Attendance`','DO 1') FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Attendance' AND INDEX_NAME='Attendance_classId_fkey');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- DropIndex: Attendance_studentId_fkey
SET @s=(SELECT IF(COUNT(*)>0,'DROP INDEX `Attendance_studentId_fkey` ON `Attendance`','DO 1') FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Attendance' AND INDEX_NAME='Attendance_studentId_fkey');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- DropIndex: Class_instructorId_fkey
SET @s=(SELECT IF(COUNT(*)>0,'DROP INDEX `Class_instructorId_fkey` ON `Class`','DO 1') FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Class' AND INDEX_NAME='Class_instructorId_fkey');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- DropIndex: Enrollment_classId_fkey
SET @s=(SELECT IF(COUNT(*)>0,'DROP INDEX `Enrollment_classId_fkey` ON `Enrollment`','DO 1') FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Enrollment' AND INDEX_NAME='Enrollment_classId_fkey');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- DropIndex: Enrollment_studentId_fkey
SET @s=(SELECT IF(COUNT(*)>0,'DROP INDEX `Enrollment_studentId_fkey` ON `Enrollment`','DO 1') FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Enrollment' AND INDEX_NAME='Enrollment_studentId_fkey');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- DropIndex: Payment_studentId_fkey
SET @s=(SELECT IF(COUNT(*)>0,'DROP INDEX `Payment_studentId_fkey` ON `Payment`','DO 1') FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Payment' AND INDEX_NAME='Payment_studentId_fkey');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- CreateTable
CREATE TABLE IF NOT EXISTS `GalleryEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `eventDate` DATETIME(3) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `GalleryPhoto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` INTEGER NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `sizeBytes` INTEGER NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey: Class_instructorId_fkey
SET @s=(SELECT IF(COUNT(*)=0,'ALTER TABLE `Class` ADD CONSTRAINT `Class_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `Instructor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE','DO 1') FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Class' AND CONSTRAINT_NAME='Class_instructorId_fkey' AND CONSTRAINT_TYPE='FOREIGN KEY');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- AddForeignKey: Enrollment_studentId_fkey
SET @s=(SELECT IF(COUNT(*)=0,'ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE','DO 1') FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Enrollment' AND CONSTRAINT_NAME='Enrollment_studentId_fkey' AND CONSTRAINT_TYPE='FOREIGN KEY');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- AddForeignKey: Enrollment_classId_fkey
SET @s=(SELECT IF(COUNT(*)=0,'ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE','DO 1') FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Enrollment' AND CONSTRAINT_NAME='Enrollment_classId_fkey' AND CONSTRAINT_TYPE='FOREIGN KEY');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- AddForeignKey: Payment_studentId_fkey
SET @s=(SELECT IF(COUNT(*)=0,'ALTER TABLE `Payment` ADD CONSTRAINT `Payment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE','DO 1') FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Payment' AND CONSTRAINT_NAME='Payment_studentId_fkey' AND CONSTRAINT_TYPE='FOREIGN KEY');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- AddForeignKey: Attendance_studentId_fkey
SET @s=(SELECT IF(COUNT(*)=0,'ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE','DO 1') FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Attendance' AND CONSTRAINT_NAME='Attendance_studentId_fkey' AND CONSTRAINT_TYPE='FOREIGN KEY');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- AddForeignKey: Attendance_classId_fkey
SET @s=(SELECT IF(COUNT(*)=0,'ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE','DO 1') FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Attendance' AND CONSTRAINT_NAME='Attendance_classId_fkey' AND CONSTRAINT_TYPE='FOREIGN KEY');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- AddForeignKey: Anamnesis_studentId_fkey
SET @s=(SELECT IF(COUNT(*)=0,'ALTER TABLE `Anamnesis` ADD CONSTRAINT `Anamnesis_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE SET NULL ON UPDATE CASCADE','DO 1') FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='Anamnesis' AND CONSTRAINT_NAME='Anamnesis_studentId_fkey' AND CONSTRAINT_TYPE='FOREIGN KEY');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- AddForeignKey: DanceEvaluation_studentId_fkey
SET @s=(SELECT IF(COUNT(*)=0,'ALTER TABLE `DanceEvaluation` ADD CONSTRAINT `DanceEvaluation_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE','DO 1') FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='DanceEvaluation' AND CONSTRAINT_NAME='DanceEvaluation_studentId_fkey' AND CONSTRAINT_TYPE='FOREIGN KEY');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- AddForeignKey: GalleryPhoto_eventId_fkey
SET @s=(SELECT IF(COUNT(*)=0,'ALTER TABLE `GalleryPhoto` ADD CONSTRAINT `GalleryPhoto_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `GalleryEvent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE','DO 1') FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='GalleryPhoto' AND CONSTRAINT_NAME='GalleryPhoto_eventId_fkey' AND CONSTRAINT_TYPE='FOREIGN KEY');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- AddForeignKey: _StudentPlans_A_fkey
SET @s=(SELECT IF(COUNT(*)=0,'ALTER TABLE `_StudentPlans` ADD CONSTRAINT `_StudentPlans_A_fkey` FOREIGN KEY (`A`) REFERENCES `Plan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE','DO 1') FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='_StudentPlans' AND CONSTRAINT_NAME='_StudentPlans_A_fkey' AND CONSTRAINT_TYPE='FOREIGN KEY');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

-- AddForeignKey: _StudentPlans_B_fkey
SET @s=(SELECT IF(COUNT(*)=0,'ALTER TABLE `_StudentPlans` ADD CONSTRAINT `_StudentPlans_B_fkey` FOREIGN KEY (`B`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE','DO 1') FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='_StudentPlans' AND CONSTRAINT_NAME='_StudentPlans_B_fkey' AND CONSTRAINT_TYPE='FOREIGN KEY');
PREPARE s FROM @s;
EXECUTE s;
DEALLOCATE PREPARE s;

