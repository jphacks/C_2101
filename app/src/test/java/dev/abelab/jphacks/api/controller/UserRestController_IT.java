package dev.abelab.jphacks.api.controller;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.TestInstance.Lifecycle.*;
import static org.junit.jupiter.params.provider.Arguments.*;

import java.util.Arrays;
import java.util.stream.Stream;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.modelmapper.ModelMapper;

import dev.abelab.jphacks.api.request.LoginUserUpdateRequest;
import dev.abelab.jphacks.api.response.UserResponse;
import dev.abelab.jphacks.api.response.UsersResponse;
import dev.abelab.jphacks.db.entity.User;
import dev.abelab.jphacks.db.entity.UserExample;
import dev.abelab.jphacks.db.mapper.UserMapper;
import dev.abelab.jphacks.helper.sample.UserSample;
import dev.abelab.jphacks.helper.util.RandomUtil;
import dev.abelab.jphacks.exception.ErrorCode;
import dev.abelab.jphacks.exception.BaseException;
import dev.abelab.jphacks.exception.BadRequestException;
import dev.abelab.jphacks.exception.NotFoundException;
import dev.abelab.jphacks.exception.ConflictException;
import dev.abelab.jphacks.exception.UnauthorizedException;

/**
 * UserRestController Integration Test
 */
public class UserRestController_IT extends AbstractRestController_IT {

	// API PATH
	static final String BASE_PATH = "/api/users";
	static final String GET_USERS_PATH = BASE_PATH;
	static final String GET_LOGIN_USER_PATH = BASE_PATH + "/me";
	static final String UPDATE_LOGIN_USER_PATH = BASE_PATH + "/me";
	static final String DELETE_LOGIN_USER_PATH = BASE_PATH + "/me";

	@Autowired
	ModelMapper modelMapper;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	UserMapper userMapper;

	/**
	 * ログインユーザ詳細取得APIのテスト
	 */
	@Nested
	@TestInstance(PER_CLASS)
	class GetLoginUserTest extends AbstractRestControllerInitialization_IT {

		@Test
		void 正_ログインユーザの詳細を取得() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			/*
			 * test
			 */
			final var request = getRequest(GET_LOGIN_USER_PATH);
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			final var response = execute(request, HttpStatus.OK, UserResponse.class);

			/*
			 * verify
			 */
			assertThat(response) //
				.extracting(UserResponse::getId, UserResponse::getEmail, UserResponse::getName) //
				.containsExactly(loginUser.getId(), loginUser.getEmail(), loginUser.getName());
			assertThat(response.getIconUrl()).isNotNull();
		}

		@Test
		void 異_存在しないユーザの場合は取得不可() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(false);
			final var credentials = getLoginUserCredentials(loginUser);

			/*
			 * test & verify
			 */
			final var request = getRequest(GET_LOGIN_USER_PATH);
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, new NotFoundException(ErrorCode.NOT_FOUND_USER));
		}

		@Test
		void 異_無効な認証ヘッダ() throws Exception {
			/*
			 * test & verify
			 */
			final var request = getRequest(GET_LOGIN_USER_PATH);
			request.header(HttpHeaders.AUTHORIZATION, "");
			execute(request, new UnauthorizedException(ErrorCode.INVALID_ACCESS_TOKEN));
		}

	}

	/**
	 * ユーザ一覧取得APIのテスト
	 */
	@Nested
	@TestInstance(PER_CLASS)
	class GetUsersTest extends AbstractRestControllerInitialization_IT {

		@Test
		void 正_ユーザ一覧を取得() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var users = Arrays.asList( //
				loginUser, //
				UserSample.builder().email(RandomUtil.generateEmail()).build(), //
				UserSample.builder().email(RandomUtil.generateEmail()).build() //
			);
			userMapper.insert(users.get(1));
			userMapper.insert(users.get(2));

			/*
			 * test
			 */
			final var request = getRequest(GET_USERS_PATH);
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			final var response = execute(request, HttpStatus.OK, UsersResponse.class);

			/*
			 * verify
			 */
			assertThat(response.getUsers()) //
				.extracting(UserResponse::getId, UserResponse::getEmail, UserResponse::getName) //
				.containsExactlyElementsOf(
					users.stream().map(user -> tuple(user.getId(), user.getEmail(), user.getName())).collect(Collectors.toList()));
			response.getUsers().forEach(user -> assertThat(user.getIconUrl()).isNotNull());
		}

		@Test
		void 異_無効な認証ヘッダ() throws Exception {
			/*
			 * test & verify
			 */
			final var request = getRequest(GET_USERS_PATH);
			request.header(HttpHeaders.AUTHORIZATION, "");
			execute(request, new UnauthorizedException(ErrorCode.INVALID_ACCESS_TOKEN));
		}

	}

	/**
	 * ログインユーザ更新APIのテスト
	 */
	@Nested
	@TestInstance(PER_CLASS)
	class UpdateLoginUserTest extends AbstractRestControllerInitialization_IT {

		@Test
		void 正_ログインユーザを更新() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			loginUser.setEmail(loginUser.getEmail() + "xxx");
			loginUser.setName(loginUser.getName() + "xxx");
			final var requestBody = modelMapper.map(loginUser, LoginUserUpdateRequest.class);

			/*
			 * test
			 */
			final var request = putRequest(UPDATE_LOGIN_USER_PATH, requestBody);
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, HttpStatus.OK);

			/*
			 * verify
			 */
			final var updatedUser = userMapper.selectByExample(new UserExample() {
				{
					createCriteria().andIdEqualTo(loginUser.getId());
				}
			}).stream().findFirst();
			assertThat(updatedUser.isPresent()).isTrue();
			assertThat(updatedUser.get()) //
				.extracting(User::getEmail, User::getName) //
				.containsExactly(loginUser.getEmail(), loginUser.getName());
		}

		@Test
		void 異_更新後のメールアドレスが既に存在する() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var user = UserSample.builder().email(RandomUtil.generateEmail()).build();
			userMapper.insert(user);

			loginUser.setEmail(user.getEmail());
			loginUser.setName(loginUser.getName() + "xxx");
			final var requestBody = modelMapper.map(loginUser, LoginUserUpdateRequest.class);

			/*
			 * test & verify
			 */
			final var request = putRequest(UPDATE_LOGIN_USER_PATH, requestBody);
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, new ConflictException(ErrorCode.CONFLICT_EMAIL));

		}

		@Test
		void 異_更新対象ユーザが存在しない() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(false);
			final var credentials = getLoginUserCredentials(loginUser);

			final var requestBody = modelMapper.map(loginUser, LoginUserUpdateRequest.class);

			/*
			 * test & verify
			 */
			final var request = putRequest(UPDATE_LOGIN_USER_PATH, requestBody);
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, new NotFoundException(ErrorCode.NOT_FOUND_USER));
		}

		@Test
		void 異_無効な認証ヘッダ() throws Exception {
			/*
			 * given
			 */
			final var user = UserSample.builder().build();
			final var requestBody = modelMapper.map(user, LoginUserUpdateRequest.class);

			/*
			 * test & verify
			 */
			final var request = putRequest(UPDATE_LOGIN_USER_PATH, requestBody);
			request.header(HttpHeaders.AUTHORIZATION, "");
			execute(request, new UnauthorizedException(ErrorCode.INVALID_ACCESS_TOKEN));
		}

	}

	/**
	 * ログインユーザ削除APIのテスト
	 */
	@Nested
	@TestInstance(PER_CLASS)
	class DeleteLoginUserTest extends AbstractRestControllerInitialization_IT {

		@Test
		void 正_ログインユーザを削除() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			/*
			 * test
			 */
			final var request = deleteRequest(DELETE_LOGIN_USER_PATH);
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, HttpStatus.OK);

			/*
			 * verify
			 */
			final var deletedUser = userMapper.selectByPrimaryKey(loginUser.getId());
			assertThat(deletedUser).isNull();
		}

		@Test
		void 異_無効な認証ヘッダ() throws Exception {
			/*
			 * test & verify
			 */
			final var request = deleteRequest(DELETE_LOGIN_USER_PATH);
			request.header(HttpHeaders.AUTHORIZATION, "");
			execute(request, new UnauthorizedException(ErrorCode.INVALID_ACCESS_TOKEN));
		}

	}

}
