package dev.abelab.jphacks.logic;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.TestInstance.Lifecycle.*;
import static org.mockito.ArgumentMatchers.*;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import mockit.Expectations;
import mockit.Injectable;
import mockit.Tested;

import org.springframework.security.crypto.password.PasswordEncoder;

import dev.abelab.jphacks.repository.UserRepository;
import dev.abelab.jphacks.property.JwtProperty;
import dev.abelab.jphacks.exception.ErrorCode;
import dev.abelab.jphacks.exception.UnauthorizedException;
import dev.abelab.jphacks.helper.sample.UserSample;

public class UserLogic_UT extends AbstractLogic_UT {

	@Injectable
	UserRepository userRepository;

	@Injectable
	JwtProperty jwtProperty;

	@Injectable
	PasswordEncoder passwordEncoder;

	@Tested
	UserLogic userLogic;

	/**
	 * Test for generate jwt
	 */
	@Nested
	@TestInstance(PER_CLASS)
	public class GenerateJwtTest {

		@Test
		void 正_ユーザのJWTを発行する() {
			new Expectations() {
				{
					jwtProperty.getIssuer();
					result = SAMPLE_STR;
				}
				{
					jwtProperty.getSecret();
					result = SAMPLE_STR;
				}
				{
					jwtProperty.getValidHour();
					result = 24 * 7;
				}
			};

			// setup
			final var user = UserSample.builder().build();

			// verify
			final var jwt = userLogic.generateJwt(user);
			assertThat(jwt).matches("[A-Za-z0-9-_]+.[A-Za-z0-9-_]+.[A-Za-z0-9-_]+");
		}

	}

	/**
	 * Test for get login user
	 */
	@Nested
	@TestInstance(PER_CLASS)
	public class GetLoginUserTest {

		@Test
		void 正_有効なJWTからログインユーザを取得() {
			// setup
			final var user = UserSample.builder().build();

			new Expectations() {
				{
					userRepository.selectById(anyInt);
					result = user;
				}
				{
					jwtProperty.getIssuer();
					result = SAMPLE_STR;
				}
				{
					jwtProperty.getSecret();
					result = SAMPLE_STR;
				}
				{
					jwtProperty.getValidHour();
					result = 24 * 7;
				}
			};

			// verify
			final var jwt = userLogic.generateJwt(user);
			final var loginUser = userLogic.getLoginUser(jwt);
			assertThat(loginUser.getId()).isEqualTo(user.getId());
		}

		@Test
		void 異_無効なJWT() {

			new Expectations() {
				{
					jwtProperty.getSecret();
					result = SAMPLE_STR;
				}
			};

			// verify
			final var exception = assertThrows(UnauthorizedException.class, () -> userLogic.getLoginUser(SAMPLE_STR));
			assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.INVALID_ACCESS_TOKEN);
		}

	}

	/**
	 * Test for encode password
	 */
	@Nested
	@TestInstance(PER_CLASS)
	public class EncodePasswordTest {

		@Test
		void 正_パスワードをハッシュ化() {
			new Expectations() {
				{
					passwordEncoder.encode(anyString);
					result = SAMPLE_STR;
				}
			};

			// verify
			final var encodedPassword = userLogic.encodePassword(SAMPLE_STR);
			assertThat(encodedPassword).isEqualTo(SAMPLE_STR);
		}

	}

	/**
	 * Test for verify password
	 */
	@Nested
	@TestInstance(PER_CLASS)
	public class VerifyPasswordTest {

		@Test
		void 正_パスワードが一致している() {
			final var user = UserSample.builder().build();

			new Expectations() {
				{
					passwordEncoder.matches(anyString, anyString);
					result = true;
				}
			};

			// verify
			assertDoesNotThrow(() -> userLogic.verifyPassword(user, anyString()));
		}

		@Test
		void 異_パスワードが間違っている() {
			// setup
			final var user = UserSample.builder().build();

			new Expectations() {
				{
					passwordEncoder.matches(anyString, anyString);
					result = false;
				}
			};

			// verify
			final var exception = assertThrows(UnauthorizedException.class, () -> userLogic.verifyPassword(user, anyString()));
			assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.WRONG_PASSWORD);
		}

	}

}
