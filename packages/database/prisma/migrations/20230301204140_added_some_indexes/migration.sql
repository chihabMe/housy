/*
  Warnings:

  - You are about to drop the column `location` on the `Property` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Property` DROP COLUMN `location`,
    MODIFY `title` VARCHAR(300) NOT NULL,
    MODIFY `description` VARCHAR(1000) NOT NULL;

-- CreateIndex
CREATE INDEX `Property_street_idx` ON `Property`(`street`);

-- CreateIndex
CREATE INDEX `Property_city_idx` ON `Property`(`city`);

-- CreateIndex
CREATE INDEX `Property_builtYear_idx` ON `Property`(`builtYear`);
