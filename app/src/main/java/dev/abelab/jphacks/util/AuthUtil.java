package dev.abelab.jphacks.util;

import java.util.Base64;
import java.nio.charset.StandardCharsets;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.InvalidKeyException;

import dev.abelab.jphacks.exception.ErrorCode;
import dev.abelab.jphacks.exception.BadRequestException;
import dev.abelab.jphacks.exception.InternalServerErrorException;

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

    /**
     * HMAC-SHA256でハッシュ化
     *
     * @param plainText 平文
     * @param secret    鍵
     *
     * @return ハッシュ値
     */
    public static String hmacSHA256(final String plainText, final String secret) {
        final var algorithm = "HmacSHA256";

        try {
            final var secretKeySpec = new SecretKeySpec(secret.getBytes(), algorithm);
            final var mac = Mac.getInstance(algorithm);
            mac.init(secretKeySpec);

            final var hash = mac.doFinal(plainText.getBytes());
            return new String(Base64.getEncoder().encode(hash), StandardCharsets.UTF_8);
        } catch (NoSuchAlgorithmException e) {
            throw new InternalServerErrorException(ErrorCode.UNEXPECTED_ERROR);
        } catch (InvalidKeyException e) {
            throw new InternalServerErrorException(ErrorCode.UNEXPECTED_ERROR);
        }
    }

}
