-- CreateTable
CREATE TABLE `BillingDetails` (
    `id` VARCHAR(191) NOT NULL,
    `client` VARCHAR(191) NOT NULL,
    `Date` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `TaxType` VARCHAR(191) NOT NULL,
    `invoiceType` VARCHAR(191) NOT NULL,

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
    `total` INTEGER NOT NULL,
    `billingDetailsId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductDetails` ADD CONSTRAINT `ProductDetails_billingDetailsId_fkey` FOREIGN KEY (`billingDetailsId`) REFERENCES `BillingDetails`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
