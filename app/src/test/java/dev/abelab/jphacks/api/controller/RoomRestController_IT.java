package dev.abelab.jphacks.api.controller;

import static org.assertj.core.api.Assertions.*;
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

import dev.abelab.jphacks.api.response.UserResponse;
import dev.abelab.jphacks.api.response.SpeakerResponse;
import dev.abelab.jphacks.api.response.RoomResponse;
import dev.abelab.jphacks.api.response.RoomsResponse;
import dev.abelab.jphacks.db.entity.Room;
import dev.abelab.jphacks.db.entity.RoomExample;
import dev.abelab.jphacks.db.mapper.UserMapper;
import dev.abelab.jphacks.db.mapper.RoomMapper;
import dev.abelab.jphacks.db.mapper.ParticipationMapper;
import dev.abelab.jphacks.enums.ParticipationTypeEnum;
import dev.abelab.jphacks.helper.sample.UserSample;
import dev.abelab.jphacks.helper.sample.RoomSample;
import dev.abelab.jphacks.helper.sample.ParticipationSample;
import dev.abelab.jphacks.helper.util.RandomUtil;
import dev.abelab.jphacks.exception.ErrorCode;
import dev.abelab.jphacks.exception.BaseException;
import dev.abelab.jphacks.exception.BadRequestException;
import dev.abelab.jphacks.exception.NotFoundException;
import dev.abelab.jphacks.exception.ConflictException;
import dev.abelab.jphacks.exception.UnauthorizedException;

/**
 * RoomRestController Integration Test
 */
public class RoomRestController_IT extends AbstractRestController_IT {

	// API PATH
	static final String BASE_PATH = "/api/rooms";
	static final String GET_ROOMS_PATH = BASE_PATH;

	@Autowired
	ModelMapper modelMapper;

	@Autowired
	UserMapper userMapper;

	@Autowired
	RoomMapper roomMapper;

	@Autowired
	ParticipationMapper participationMapper;

	/**
	 * ルーム一覧取得APIのテスト
	 */
	@Nested
	@TestInstance(PER_CLASS)
	class GetRoomsTest extends AbstractRestControllerInitialization_IT {

		@Test
		void 正_ルーム一覧を取得() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var rooms = Arrays.asList( //
				RoomSample.builder().ownerId(loginUser.getId()).build(), //
				RoomSample.builder().ownerId(loginUser.getId()).build(), //
				RoomSample.builder().ownerId(loginUser.getId()).build() //
			);
			rooms.forEach(roomMapper::insert);

			// ルーム参加者
			final var users = Arrays.asList( //
				UserSample.builder().email(RandomUtil.generateEmail()).build(), //
				UserSample.builder().email(RandomUtil.generateEmail()).build() //
			);
			users.forEach(userMapper::insert);

			final var participations = Arrays.asList( //
				// ルーム1
				ParticipationSample.builder().userId(users.get(0).getId()).roomId(rooms.get(0).getId())
					.type(ParticipationTypeEnum.VIEWER.getId()).build(), //
				ParticipationSample.builder().userId(users.get(1).getId()).roomId(rooms.get(0).getId())
					.type(ParticipationTypeEnum.SPEAKER.getId()).title(SAMPLE_STR).build(), //
				// ルーム2
				ParticipationSample.builder().userId(users.get(0).getId()).roomId(rooms.get(1).getId())
					.type(ParticipationTypeEnum.SPEAKER.getId()).title(SAMPLE_STR).build(), //
				ParticipationSample.builder().userId(users.get(1).getId()).roomId(rooms.get(1).getId())
					.type(ParticipationTypeEnum.SPEAKER.getId()).title(null).build() //
			);
			participations.forEach(participationMapper::insert);

			/*
			 * test
			 */
			final var request = getRequest(GET_ROOMS_PATH);
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			final var response = execute(request, HttpStatus.OK, RoomsResponse.class);

			/*
			 * verify
			 */
			assertThat(response.getRooms()) //
				.extracting(RoomResponse::getId, RoomResponse::getTitle, RoomResponse::getDescription) //
				.containsExactlyElementsOf(
					rooms.stream().map(room -> tuple(room.getId(), room.getTitle(), room.getDescription())).collect(Collectors.toList()));

			// オーナー
			response.getRooms().forEach(room -> {
				assertThat(room.getOwner()) //
					.extracting(UserResponse::getId, UserResponse::getEmail, UserResponse::getName) //
					.containsExactly(loginUser.getId(), loginUser.getEmail(), loginUser.getName());
			});

			// 登壇者
			assertThat(response.getRooms().get(0).getSpeakers()) //
				.extracting(SpeakerResponse::getId, SpeakerResponse::getEmail, SpeakerResponse::getName, SpeakerResponse::getTitle) //
				.containsExactlyInAnyOrder(tuple(users.get(1).getId(), users.get(1).getEmail(), users.get(1).getName(), SAMPLE_STR));
			assertThat(response.getRooms().get(1).getSpeakers()) //
				.extracting(SpeakerResponse::getId, SpeakerResponse::getEmail, SpeakerResponse::getName, SpeakerResponse::getTitle) //
				.containsExactlyInAnyOrder( //
					tuple(users.get(0).getId(), users.get(0).getEmail(), users.get(0).getName(), SAMPLE_STR),
					tuple(users.get(1).getId(), users.get(1).getEmail(), users.get(1).getName(), null));
			assertThat(response.getRooms().get(2).getSpeakers().size()).isEqualTo(0);

			// 閲覧者
			assertThat(response.getRooms().get(0).getViewers()) //
				.extracting(UserResponse::getId, UserResponse::getEmail, UserResponse::getName) //
				.containsExactlyInAnyOrder(tuple(users.get(0).getId(), users.get(0).getEmail(), users.get(0).getName()));
			assertThat(response.getRooms().get(1).getViewers().size()).isEqualTo(0);
			assertThat(response.getRooms().get(2).getViewers().size()).isEqualTo(0);
		}

		@Test
		void 異_無効な認証ヘッダ() throws Exception {
			/*
			 * test & verify
			 */
			final var request = getRequest(GET_ROOMS_PATH);
			request.header(HttpHeaders.AUTHORIZATION, "");
			execute(request, new UnauthorizedException(ErrorCode.INVALID_ACCESS_TOKEN));
		}

	}

}
