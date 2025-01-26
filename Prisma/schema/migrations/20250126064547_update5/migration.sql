-- AlterTable
ALTER TABLE `BillingDetails` ADD COLUMN `bankName` VARCHAR(191) NULL,
    ADD COLUMN `chequeAmount` DOUBLE NULL,
    ADD COLUMN `chequeNumber` VARCHAR(191) NULL,
    ADD COLUMN `placeOfSupply` VARCHAR(191) NULL,
    ADD COLUMN `poNO` INTEGER NULL,
    ADD COLUMN `transport` VARCHAR(191) NULL,
    ADD COLUMN `vehicleNo` INTEGER NULL;
