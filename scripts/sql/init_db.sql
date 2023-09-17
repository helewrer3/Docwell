CREATE TABLE IF NOT EXISTS `user_accounts`(
    `user_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `salt` VARCHAR(255) NOT NULL,
    `is_admin` TINYINT(1) DEFAULT 0,
    `is_user` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `patients`(
    `patient_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(255) NOT NULL,
    `date_of_birth` DATE NOT NULL,
    `sex` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `visits`(
    `visit_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `patient_id` BIGINT UNSIGNED NOT NULL,
    `date_of_visit` DATE NOT NULL,
    `reports_url` VARCHAR(255) DEFAULT 'null',
    `advice` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `prescriptions`(
    `prescription_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `visit_id` BIGINT UNSIGNED NOT NULL,
    `medicine_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `medicines`(
    `medicine_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `manufacturer_id` BIGINT UNSIGNED NOT NULL,
    `salt_1_name` VARCHAR(255) NULL,
    `salt_2_name` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `medicine_manufacturers`(
    `manufacturer_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE
    `user_accounts` ADD UNIQUE `user_name_unique`(`name`);

ALTER TABLE
    `patients` ADD UNIQUE `patient_name_phone_number_unique`(`name`, `phone_number`);

ALTER TABLE
    `medicine_manufacturers` ADD UNIQUE `medicine_manufacturer_id_name`(`name`);

ALTER TABLE
    `visits` ADD CONSTRAINT `visit_patient_id_foreign` FOREIGN KEY(`patient_id`) REFERENCES `patients`(`patient_id`);

ALTER TABLE
    `prescriptions` ADD CONSTRAINT `prescription_visit_id_foreign` FOREIGN KEY(`visit_id`) REFERENCES `visits`(`visit_id`);

ALTER TABLE
    `prescriptions` ADD CONSTRAINT `prescription_medicine_id_foreign` FOREIGN KEY(`medicine_id`) REFERENCES `medicines`(`medicine_id`);

ALTER TABLE
    `medicines` ADD CONSTRAINT `medicine_manufacturer_id_foreign` FOREIGN KEY(`manufacturer_id`) REFERENCES `medicine_manufacturers`(`manufacturer_id`);