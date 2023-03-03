-- DropForeignKey
ALTER TABLE `Property` DROP FOREIGN KEY `Property_propertyId_fkey`;

-- DropForeignKey
ALTER TABLE `Property` DROP FOREIGN KEY `Property_publisherId_fkey`;

-- DropForeignKey
ALTER TABLE `PropertyImage` DROP FOREIGN KEY `PropertyImage_propertyId_fkey`;

-- AddForeignKey
ALTER TABLE `Property` ADD CONSTRAINT `Property_publisherId_fkey` FOREIGN KEY (`publisherId`) REFERENCES `Profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Property` ADD CONSTRAINT `Property_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `PropertyCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyImage` ADD CONSTRAINT `PropertyImage_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
