/*
  Warnings:

  - A unique constraint covering the columns `[refrence]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Inventory_refrence_key` ON `Inventory`(`refrence`);
