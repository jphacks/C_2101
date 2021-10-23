package dev.abelab.jphacks.enums;

import java.util.Arrays;

import lombok.*;
import dev.abelab.jphacks.exception.ErrorCode;
import dev.abelab.jphacks.exception.NotFoundException;

/**
 * The enum participation type
 */
@Getter
@AllArgsConstructor
public enum ParticipationTypeEnum {

    SPEAKER(1, "登壇者"),

    VIEWER(2, "閲覧者");

    private final int id;

    private final String name;

    /**
     * find by id
     *
     * @param id id
     *
     * @return user role
     */
    public static ParticipationTypeEnum findById(final int id) {
        return Arrays.stream(values()).filter(e -> e.getId() == id) //
            .findFirst().orElseThrow(() -> new NotFoundException(ErrorCode.NOT_FOUND_PARTICIPATION_TYPE));
    }

}
