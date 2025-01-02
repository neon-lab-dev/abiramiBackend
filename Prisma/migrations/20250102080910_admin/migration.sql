/*
  Warnings:

  - You are about to alter the column `status` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - Added the required column `companyName` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Client` MODIFY `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL;

-- AlterTable
ALTER TABLE `Supplier` ADD COLUMN `companyName` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `admin` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
