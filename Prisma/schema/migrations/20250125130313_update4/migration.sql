/*
  Warnings:

  - You are about to drop the column `discount` on the `ProductDetails` table. All the data in the column will be lost.
  - You are about to drop the column `pfAmount` on the `ProductDetails` table. All the data in the column will be lost.
  - You are about to drop the column `roundOff` on the `ProductDetails` table. All the data in the column will be lost.
  - You are about to drop the column `subTotal` on the `ProductDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `BillingDetails` ADD COLUMN `discount` DOUBLE NULL,
    ADD COLUMN `pfAmount` DOUBLE NULL,
    ADD COLUMN `roundOff` DOUBLE NULL,
    ADD COLUMN `subTotal` DOUBLE NULL;

-- AlterTable
ALTER TABLE `ProductDetails` DROP COLUMN `discount`,
    DROP COLUMN `pfAmount`,
    DROP COLUMN `roundOff`,
    DROP COLUMN `subTotal`;
