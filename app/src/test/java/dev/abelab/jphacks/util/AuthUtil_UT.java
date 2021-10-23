package dev.abelab.jphacks.util;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.TestInstance.Lifecycle.*;
import static org.junit.jupiter.params.provider.Arguments.*;

import java.util.stream.Stream;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import dev.abelab.jphacks.exception.ErrorCode;
import dev.abelab.jphacks.exception.BaseException;
import dev.abelab.jphacks.exception.BadRequestException;

public class AuthUtil_UT extends AbstractUtil_UT {

	/**
	 * Test for validate password
	 */
	@Nested
	@TestInstance(PER_CLASS)
	public class ValidatePasswordTest {

		@ParameterizedTest
		@MethodSource
		void 有効なパスワードかチェック(final String password, final BaseException expectedException) {
			// verify
			if (expectedException == null) {
				assertDoesNotThrow(() -> AuthUtil.validatePassword(password));
			} else {
				final var exception = assertThrows(expectedException.getClass(), () -> AuthUtil.validatePassword(password));
				assertThat(exception.getErrorCode()).isEqualTo(exception.getErrorCode());
			}
		}

		Stream<Arguments> 有効なパスワードかチェック() {
			return Stream.of( // パスワード、期待される例外
				// 有効
				arguments("f4BabxEr", null), //
				arguments("f4BabxEr4gNsjdtRpH9Pfs6Atth9bqdA", null), //
				// 無効：8文字以下
				arguments("f4BabxE", new BadRequestException(ErrorCode.INVALID_PASSWORD_SIZE)), //
				// 無効：33文字以上
				arguments("f4BabxEr4gNsjdtRpH9Pfs6Atth9bqdAN", new BadRequestException(ErrorCode.INVALID_PASSWORD_SIZE)), //
				// 無効：大文字を含まない
				arguments("f4babxer", new BadRequestException(ErrorCode.TOO_SIMPLE_PASSWORD)), //
				// 無効：小文字を含まない
				arguments("F4BABXER", new BadRequestException(ErrorCode.TOO_SIMPLE_PASSWORD)), //
				// 無効：数字を含まない
				arguments("fxbabxEr", new BadRequestException(ErrorCode.TOO_SIMPLE_PASSWORD)) //
			);
		}

	}

}
