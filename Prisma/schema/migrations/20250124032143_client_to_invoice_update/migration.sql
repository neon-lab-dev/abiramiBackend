/*
  Warnings:

  - You are about to drop the column `clientId` on the `BillingDetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[companyName]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `BillingDetails` DROP FOREIGN KEY `BillingDetails_clientId_fkey`;

-- DropIndex
DROP INDEX `BillingDetails_clientId_fkey` ON `BillingDetails`;

-- AlterTable
ALTER TABLE `BillingDetails` DROP COLUMN `clientId`;

-- CreateIndex
CREATE UNIQUE INDEX `Client_companyName_key` ON `Client`(`companyName`);

-- AddForeignKey
ALTER TABLE `BillingDetails` ADD CONSTRAINT `BillingDetails_clientName_fkey` FOREIGN KEY (`clientName`) REFERENCES `Client`(`companyName`) ON DELETE CASCADE ON UPDATE CASCADE;
