package dev.abelab.jphacks.util;

import dev.abelab.jphacks.exception.ErrorCode;
import dev.abelab.jphacks.exception.BadRequestException;

public class AuthUtil {

    /**
     * 有効なパスワードがチェック
     *
     * @param password password
     */
    public static void validatePassword(final String password) {
        // 8~32文字かどうか
        if (password.length() < 8 || password.length() > 32) {
            throw new BadRequestException(ErrorCode.INVALID_PASSWORD_SIZE);
        }
        // 大文字・小文字・数字を含むか
        if (!password.matches("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).+$")) {
            throw new BadRequestException(ErrorCode.TOO_SIMPLE_PASSWORD);
        }
    }

}
