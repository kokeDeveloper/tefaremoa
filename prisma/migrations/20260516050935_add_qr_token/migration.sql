/*
  Warnings:

  - A unique constraint covering the columns `[qrToken]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - The required column `qrToken` was added to the `Student` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
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
DROP INDEX `Payment_studentId_fkey` ON `payment`;

-- AlterTable
-- AlterTable: add as nullable first, backfill, then make required
ALTER TABLE `student` ADD COLUMN `qrToken` VARCHAR(191) NULL;

-- Backfill existing rows with a UUID
UPDATE `student` SET `qrToken` = (SELECT UUID()) WHERE `qrToken` IS NULL;

-- Now make it NOT NULL
ALTER TABLE `student` MODIFY COLUMN `qrToken` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Student_qrToken_key` ON `Student`(`qrToken`);

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
ALTER TABLE `_StudentPlans` ADD CONSTRAINT `_StudentPlans_A_fkey` FOREIGN KEY (`A`) REFERENCES `Plan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StudentPlans` ADD CONSTRAINT `_StudentPlans_B_fkey` FOREIGN KEY (`B`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
