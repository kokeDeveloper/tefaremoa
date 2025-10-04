-- AlterTable
ALTER TABLE `student` ADD COLUMN `planEndDate` DATETIME(3) NULL,
    ADD COLUMN `planStartDate` DATETIME(3) NULL,
    ADD COLUMN `planStatus` VARCHAR(191) NOT NULL DEFAULT 'Active',
    ADD COLUMN `planType` VARCHAR(191) NOT NULL DEFAULT 'Basic';
