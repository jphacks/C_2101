package dev.abelab.jphacks.exception;

import lombok.*;

/**
 * The enum error code
 */
@Getter
@AllArgsConstructor
public enum ErrorCode {

    /**
     * Internal Server Error: 1000~1099
     */
    UNEXPECTED_ERROR(1000, "exception.internal_server_error.unexpected_error"),

    /**
     * Not Found: 1100~1199
     */
    NOT_FOUND_API(1100, "exception.not_found.api"),

    NOT_FOUND_USER(1101, "exception.not_found.user"),

    NOT_FOUND_ATTACHMENT(1102, "exception.not_found.attachment"),

    NOT_FOUND_ROOM(1103, "exception.not_found.room"),

    NOT_FOUND_PARTICIPATION(1104, "exception.not_found.participation"),

    NOT_FOUND_PARTICIPATION_TYPE(1105, "exception.not_found.participation_type"),

    /**
     * Conflict: 1200~1299
     */
    CONFLICT_EMAIL(1200, "exception.conflict.email"),

    ALREADY_JOIN_ROOM(1201, "exception.conflict.already_join_room"),

    /**
     * Forbidden: 1300~1399
     */
    USER_HAS_NO_PERMISSION(1300, "exception.forbidden.user_has_no_permission"),

    /**
     * Bad Request: 1400~1499
     */
    VALIDATION_ERROR(1400, "exception.bad_request.validation_error"),

    INVALID_REQUEST_PARAMETER(1401, "exception.bad_request.invalid_request_parameter"),

    INVALID_PASSWORD_SIZE(1402, "exception.bad_request.invalid_password_size"),

    TOO_SIMPLE_PASSWORD(1403, "exception.bad_request.too_simple_password"),

    INVALID_ROOM_TIME(1404, "exception.bad_request.room_time"),

    PAST_ROOM_CANNOT_BE_CREATED(1405, "exception.bad_request.past_room_cannot_be_created"),

    CANNOT_JOIN_PAST_ROOM(1406, "exception.bad_request.cannot_join_past_room"),

    CANNOT_UNJOIN_PAST_ROOM(1407, "exception.bad_request.cannot_unjoin_past_room"),

    /**
     * Unauthorized: 1500~1599
     */
    USER_NOT_LOGGED_IN(1500, "exception.unauthorized.user_not_logged_in"),

    WRONG_PASSWORD(1501, "exception.unauthorized.wrong_password"),

    INVALID_ACCESS_TOKEN(1502, "exception.unauthorized.invalid_access_token"),

    EXPIRED_ACCESS_TOKEN(1503, "exception.unauthorized.expired_access_token");

    private final int code;

    private final String messageKey;

}
