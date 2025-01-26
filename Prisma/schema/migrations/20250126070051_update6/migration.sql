/*
  Warnings:

  - You are about to alter the column `chequeNumber` on the `BillingDetails` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `BillingDetails` MODIFY `chequeNumber` DOUBLE NULL;
