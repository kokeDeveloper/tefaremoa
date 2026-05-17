/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `label` to the `Plan` table without a default value. This is not possible if the table is not empty.

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
ALTER TABLE `plan` ADD COLUMN `isScholarship` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `label` VARCHAR(191) NOT NULL,
    ADD COLUMN `sessionsPerWeek` INTEGER NULL,
    MODIFY `price` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `student` MODIFY `planType` VARCHAR(191) NOT NULL DEFAULT '1x';

-- CreateIndex
CREATE UNIQUE INDEX `Plan_name_key` ON `Plan`(`name`);

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
