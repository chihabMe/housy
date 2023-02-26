/*
  Warnings:

  - Changed the type of `expiresAt` on the `Token` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `Token` DROP COLUMN `expiresAt`,
    ADD COLUMN `expiresAt` INTEGER NOT NULL;
