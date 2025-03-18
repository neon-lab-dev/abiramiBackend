/*
  Warnings:

  - A unique constraint covering the columns `[GST]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Purchase` MODIFY `invoiceNumber` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Client_GST_key` ON `Client`(`GST`);
