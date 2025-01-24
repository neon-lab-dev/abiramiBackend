-- DropForeignKey
ALTER TABLE `BillingDetails` DROP FOREIGN KEY `BillingDetails_clientName_fkey`;

-- DropIndex
DROP INDEX `BillingDetails_clientName_fkey` ON `BillingDetails`;
