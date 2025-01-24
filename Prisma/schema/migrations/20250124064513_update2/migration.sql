-- AddForeignKey
ALTER TABLE `BillingDetails` ADD CONSTRAINT `BillingDetails_clientName_fkey` FOREIGN KEY (`clientName`) REFERENCES `Client`(`companyName`) ON DELETE CASCADE ON UPDATE CASCADE;
