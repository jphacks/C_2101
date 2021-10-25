package dev.abelab.jphacks.api.controller;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.TestInstance.Lifecycle.*;
import static org.junit.jupiter.params.provider.Arguments.*;

import java.util.Date;
import java.util.Calendar;
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

import dev.abelab.jphacks.api.request.RoomCreateRequest;
import dev.abelab.jphacks.api.request.RoomJoinRequest;
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
import dev.abelab.jphacks.util.DateTimeUtil;
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
	static final String CREATE_ROOM_PATH = BASE_PATH;

	static final Date TOMORROW = DateTimeUtil.getTomorrow();
	static final Date YESTERDAY = DateTimeUtil.getYesterday();

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

	/**
	 * ルーム作成APIのテスト
	 */
	@Nested
	@TestInstance(PER_CLASS)
	class CreateRoomTest extends AbstractRestControllerInitialization_IT {

		@Test
		void 正_ルームを作成() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var room = RoomSample.builder() //
				.startAt(DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 10)) //
				.finishAt(DateTimeUtil.addDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 11)) //
				.build();
			final var requestBody = modelMapper.map(room, RoomCreateRequest.class);

			/*
			 * test
			 */
			final var request = postRequest(CREATE_ROOM_PATH, requestBody);
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, HttpStatus.CREATED);

			/*
			 * verify
			 */
			final var createdRoom = roomMapper.selectByExampleWithBLOBs(new RoomExample() {
				{
					createCriteria().andOwnerIdEqualTo(loginUser.getId());
				}
			});
			assertThat(createdRoom).extracting(Room::getTitle, Room::getDescription, Room::getOwnerId) //
				.containsExactly(tuple(requestBody.getTitle(), requestBody.getDescription(), loginUser.getId()));
			assertThat(createdRoom.get(0).getStartAt()).isInSameMinuteAs(room.getStartAt());
			assertThat(createdRoom.get(0).getFinishAt()).isInSameMinuteAs(room.getFinishAt());
		}

		@ParameterizedTest
		@MethodSource
		void 異_無効な開催日時は作成不可(final Date date, final int startHour, final int finishHour, final BaseException expectedException)
			throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var room = RoomSample.builder() //
				.startAt(DateTimeUtil.editDateTime(date, Calendar.HOUR_OF_DAY, startHour)) //
				.finishAt(DateTimeUtil.editDateTime(date, Calendar.HOUR_OF_DAY, finishHour)) //
				.build();
			final var requestBody = modelMapper.map(room, RoomCreateRequest.class);

			/*
			 * test & verify
			 */
			final var request = postRequest(CREATE_ROOM_PATH, requestBody);
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, expectedException);
		}

		Stream<Arguments> 異_無効な開催日時は作成不可() {
			return Stream.of(
				// 過去の日時
				arguments(YESTERDAY, 10, 11, new BadRequestException(ErrorCode.PAST_ROOM_CANNOT_BE_CREATED)), //
				// 開始時刻よりも前に終了時刻が設定されている
				arguments(TOMORROW, 11, 10, new BadRequestException(ErrorCode.INVALID_ROOM_TIME)), //
				// 開始時刻と終了時刻が同じ
				arguments(TOMORROW, 10, 10, new BadRequestException(ErrorCode.INVALID_ROOM_TIME)) //
			);
		}

		@Test
		void 異_無効な認証ヘッダ() throws Exception {
			/*
			 * given
			 */
			final var room = RoomSample.builder().build();
			final var requestBody = modelMapper.map(room, RoomCreateRequest.class);

			/*
			 * test & verify
			 */
			final var request = postRequest(CREATE_ROOM_PATH, requestBody);
			request.header(HttpHeaders.AUTHORIZATION, "");
			execute(request, new UnauthorizedException(ErrorCode.INVALID_ACCESS_TOKEN));
		}

	}

}