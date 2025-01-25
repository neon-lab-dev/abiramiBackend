/*
  Warnings:

  - You are about to drop the column `discount` on the `BillingDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `BillingDetails` DROP COLUMN `discount`;

-- AlterTable
ALTER TABLE `ProductDetails` ADD COLUMN `discount` DOUBLE NULL;
