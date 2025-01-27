/*
  Warnings:

  - You are about to alter the column `chequeNumber` on the `BillingDetails` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `BillingDetails` MODIFY `chequeNumber` VARCHAR(191) NULL;
