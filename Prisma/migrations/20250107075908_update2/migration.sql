/*
  Warnings:

  - Added the required column `pfAmount` to the `ProductDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roundOff` to the `ProductDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subTotal` to the `ProductDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxIgst` to the `ProductDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProductDetails` ADD COLUMN `pfAmount` INTEGER NOT NULL,
    ADD COLUMN `roundOff` INTEGER NOT NULL,
    ADD COLUMN `subTotal` INTEGER NOT NULL,
    ADD COLUMN `taxIgst` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `BillingDetails_id_idx` ON `BillingDetails`(`id`);

-- CreateIndex
CREATE INDEX `BillingDetails_invoiceType_idx` ON `BillingDetails`(`invoiceType`);
