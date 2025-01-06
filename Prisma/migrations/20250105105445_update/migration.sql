/*
  Warnings:

  - You are about to drop the column `Date` on the `BillingDetails` table. All the data in the column will be lost.
  - You are about to drop the column `TaxType` on the `BillingDetails` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `BillingDetails` table. All the data in the column will be lost.
  - Added the required column `billingStatus` to the `BillingDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `BillingDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxType` to the `BillingDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ProductDetails` DROP FOREIGN KEY `ProductDetails_billingDetailsId_fkey`;

-- DropIndex
DROP INDEX `ProductDetails_billingDetailsId_fkey` ON `ProductDetails`;

-- AlterTable
ALTER TABLE `BillingDetails` DROP COLUMN `Date`,
    DROP COLUMN `TaxType`,
    DROP COLUMN `status`,
    ADD COLUMN `billingStatus` VARCHAR(191) NOT NULL,
    ADD COLUMN `date` VARCHAR(191) NOT NULL,
    ADD COLUMN `taxType` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ProductDetails` ADD CONSTRAINT `ProductDetails_billingDetailsId_fkey` FOREIGN KEY (`billingDetailsId`) REFERENCES `BillingDetails`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
