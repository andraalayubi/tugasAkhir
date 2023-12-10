-- CreateTable
CREATE TABLE `Cart` (
    `cart_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `total` DECIMAL(65, 30) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`cart_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(191) NULL,
    `price` DOUBLE NULL,
    `stock_quantity` INTEGER NULL,

    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
