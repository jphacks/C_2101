CREATE TABLE IF NOT EXISTS `participation` (
  `user_id` INT UNSIGNED NOT NULL,
  `room_id` INT UNSIGNED NOT NULL,
  `type` INT NOT NULL,
  `title` VARCHAR(255) NULL,
  PRIMARY KEY (`user_id`, `room_id`),
  INDEX `fk_participation_room_id_idx` (`room_id` ASC) VISIBLE,
  CONSTRAINT `fk_participation_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_participation_room_id`
    FOREIGN KEY (`room_id`)
    REFERENCES `room` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
