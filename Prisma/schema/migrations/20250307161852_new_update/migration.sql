-- DropIndex
DROP INDEX `Client_email_key` ON `Client`;

-- DropIndex
DROP INDEX `Supplier_email_key` ON `Supplier`;

-- AlterTable
ALTER TABLE `Client` MODIFY `email` VARCHAR(191) NULL,
    MODIFY `addressLine1` VARCHAR(191) NULL,
    MODIFY `city` VARCHAR(191) NULL,
    MODIFY `pincode` INTEGER NULL,
    MODIFY `state` VARCHAR(191) NULL,
    MODIFY `country` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Supplier` MODIFY `title` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `addressLine1` VARCHAR(191) NULL,
    MODIFY `city` VARCHAR(191) NULL,
    MODIFY `pincode` INTEGER NULL,
    MODIFY `state` VARCHAR(191) NULL,
    MODIFY `country` VARCHAR(191) NULL;
