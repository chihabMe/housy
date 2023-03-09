-- AlterTable
ALTER TABLE `Token` MODIFY `expiresAt` BIGINT NOT NULL;

-- CreateIndex
CREATE INDEX `Token_token_idx` ON `Token`(`token`);
