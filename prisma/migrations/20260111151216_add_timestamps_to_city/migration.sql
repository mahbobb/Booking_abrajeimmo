/*
  Warnings:

  - You are about to drop the column `path` on the `adimage` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `subcategoryId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `cinFile` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `contractFile` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `passportFile` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `totalPersons` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `subcategory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,categoryId]` on the table `SubCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `AdImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestName` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestPhone` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Sector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `SubCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `SubCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SubCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_subcategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `subcategory` DROP FOREIGN KEY `Subcategory_categoryId_fkey`;

-- DropIndex
DROP INDEX `Category_title_key` ON `category`;

-- DropIndex
DROP INDEX `Product_subcategoryId_fkey` ON `product`;

-- DropIndex
DROP INDEX `Subcategory_title_categoryId_key` ON `subcategory`;

-- AlterTable
ALTER TABLE `adimage` DROP COLUMN `path`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `url` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `booking` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `title`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `icon` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `city` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `image`,
    DROP COLUMN `subcategoryId`,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `bathrooms` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `bedrooms` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `mainImage` VARCHAR(191) NULL,
    ADD COLUMN `maxGuests` INTEGER NOT NULL DEFAULT 2,
    ADD COLUMN `pricePer` VARCHAR(191) NOT NULL DEFAULT 'night',
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    ADD COLUMN `subCategoryId` INTEGER NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `productimage` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `reservation` DROP COLUMN `address`,
    DROP COLUMN `cinFile`,
    DROP COLUMN `contractFile`,
    DROP COLUMN `fullName`,
    DROP COLUMN `passportFile`,
    DROP COLUMN `phone`,
    DROP COLUMN `totalPersons`,
    ADD COLUMN `guestEmail` VARCHAR(191) NULL,
    ADD COLUMN `guestName` VARCHAR(191) NOT NULL,
    ADD COLUMN `guestPhone` VARCHAR(191) NOT NULL,
    ADD COLUMN `guests` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `sector` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `subcategory` DROP COLUMN `title`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Category_slug_key` ON `Category`(`slug`);

-- CreateIndex
CREATE INDEX `Product_userId_idx` ON `Product`(`userId`);

-- CreateIndex
CREATE INDEX `Product_status_idx` ON `Product`(`status`);

-- CreateIndex
CREATE INDEX `Reservation_status_idx` ON `Reservation`(`status`);

-- CreateIndex
CREATE UNIQUE INDEX `SubCategory_slug_categoryId_key` ON `SubCategory`(`slug`, `categoryId`);

-- AddForeignKey
ALTER TABLE `SubCategory` ADD CONSTRAINT `SubCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `SubCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `Booking_adId_idx` ON `Booking`(`adId`);
DROP INDEX `Booking_adId_fkey` ON `booking`;

-- RedefineIndex
CREATE INDEX `Booking_userId_idx` ON `Booking`(`userId`);
DROP INDEX `Booking_userId_fkey` ON `booking`;

-- RedefineIndex
CREATE INDEX `Product_categoryId_idx` ON `Product`(`categoryId`);
DROP INDEX `Product_categoryId_fkey` ON `product`;

-- RedefineIndex
CREATE INDEX `Product_cityId_idx` ON `Product`(`cityId`);
DROP INDEX `Product_cityId_fkey` ON `product`;

-- RedefineIndex
CREATE INDEX `ProductImage_productId_idx` ON `ProductImage`(`productId`);
DROP INDEX `ProductImage_productId_fkey` ON `productimage`;

-- RedefineIndex
CREATE INDEX `Reservation_productId_idx` ON `Reservation`(`productId`);
DROP INDEX `Reservation_productId_fkey` ON `reservation`;

-- RedefineIndex
CREATE INDEX `Reservation_userId_idx` ON `Reservation`(`userId`);
DROP INDEX `Reservation_userId_fkey` ON `reservation`;

-- RedefineIndex
CREATE INDEX `SubCategory_categoryId_idx` ON `SubCategory`(`categoryId`);
DROP INDEX `Subcategory_categoryId_fkey` ON `subcategory`;
