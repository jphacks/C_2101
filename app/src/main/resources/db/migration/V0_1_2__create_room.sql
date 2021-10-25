CREATE TABLE IF NOT EXISTS `room` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `owner_id` INT UNSIGNED NOT NULL,
  `start_at` DATETIME NOT NULL,
  `finish_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_room_owner_id_idx` (`owner_id` ASC) VISIBLE,
  CONSTRAINT `fk_room_owner_id`
    FOREIGN KEY (`owner_id`)
    REFERENCES `user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
