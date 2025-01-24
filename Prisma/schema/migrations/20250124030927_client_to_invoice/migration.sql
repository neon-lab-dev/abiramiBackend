-- CreateTable
CREATE TABLE `Client` (
    `id` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `contactPerson` VARCHAR(191) NOT NULL,
    `GST` VARCHAR(191) NOT NULL,
    `mobileNum` VARCHAR(191) NOT NULL,
    `landLineNum` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `addressLine1` VARCHAR(191) NOT NULL,
    `addressLine2` VARCHAR(191) NULL,
    `addressLine3` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `pincode` INTEGER NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updataedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Client_email_key`(`email`),
    INDEX `Client_mobileNum_idx`(`mobileNum`),
    INDEX `Client_addressLine1_idx`(`addressLine1`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `Inventory` (
    `id` VARCHAR(191) NOT NULL,
    `refrence` VARCHAR(191) NOT NULL,
    `buyingCost` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `sellingCost` INTEGER NOT NULL,
    `warehouseLocation` VARCHAR(191) NOT NULL,
    `quantityType` VARCHAR(191) NOT NULL,
    `alarm` INTEGER NOT NULL,
    `catgoryId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `fileId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `thumbnailUrl` VARCHAR(191) NOT NULL,
    `inventoryId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Image_inventoryId_key`(`inventoryId`),
    PRIMARY KEY (`fileId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BillingDetails` (
    `id` VARCHAR(191) NOT NULL,
    `clientName` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL,
    `billingStatus` VARCHAR(191) NOT NULL,
    `taxType` VARCHAR(191) NOT NULL,
    `invoiceType` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,

    INDEX `BillingDetails_id_idx`(`id`),
    INDEX `BillingDetails_invoiceType_idx`(`invoiceType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductDetails` (
    `id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `HSNno` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `rate` INTEGER NOT NULL,
    `discount` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `subTotal` INTEGER NOT NULL,
    `pfAmount` INTEGER NOT NULL,
    `taxIgst` INTEGER NOT NULL,
    `roundOff` INTEGER NOT NULL,
    `total` INTEGER NOT NULL,
    `billingDetailsId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Purchase` (
    `id` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `invoiceNumber` INTEGER NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `totalPurchaseAmt` INTEGER NOT NULL,
    `gstNum` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `GST` VARCHAR(191) NOT NULL,
    `mobileNum` VARCHAR(191) NOT NULL,
    `landLineNum` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `addressLine1` VARCHAR(191) NOT NULL,
    `addressLine2` VARCHAR(191) NULL,
    `addressLine3` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `pincode` INTEGER NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updataedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Supplier_email_key`(`email`),
    INDEX `Supplier_mobileNum_idx`(`mobileNum`),
    INDEX `Supplier_addressLine1_idx`(`addressLine1`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_catgoryId_fkey` FOREIGN KEY (`catgoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `Inventory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BillingDetails` ADD CONSTRAINT `BillingDetails_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductDetails` ADD CONSTRAINT `ProductDetails_billingDetailsId_fkey` FOREIGN KEY (`billingDetailsId`) REFERENCES `BillingDetails`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
