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
import org.modelmapper.ModelMapper;
import mockit.Expectations;
import mockit.Mocked;

import dev.abelab.jphacks.api.request.RoomCreateRequest;
import dev.abelab.jphacks.api.request.RoomJoinRequest;
import dev.abelab.jphacks.api.request.RoomAuthenticateRequest;
import dev.abelab.jphacks.api.response.UserResponse;
import dev.abelab.jphacks.api.response.SpeakerResponse;
import dev.abelab.jphacks.api.response.RoomResponse;
import dev.abelab.jphacks.api.response.RoomsResponse;
import dev.abelab.jphacks.api.response.RoomCredentialsResponse;
import dev.abelab.jphacks.db.entity.Room;
import dev.abelab.jphacks.db.entity.RoomExample;
import dev.abelab.jphacks.db.entity.Participation;
import dev.abelab.jphacks.db.entity.ParticipationExample;
import dev.abelab.jphacks.db.mapper.UserMapper;
import dev.abelab.jphacks.db.mapper.RoomMapper;
import dev.abelab.jphacks.db.mapper.ParticipationMapper;
import dev.abelab.jphacks.model.FileModel;
import dev.abelab.jphacks.model.SkywayCredentialsModel;
import dev.abelab.jphacks.enums.ParticipationTypeEnum;
import dev.abelab.jphacks.helper.sample.UserSample;
import dev.abelab.jphacks.helper.sample.RoomSample;
import dev.abelab.jphacks.helper.sample.ParticipationSample;
import dev.abelab.jphacks.helper.util.RandomUtil;
import dev.abelab.jphacks.util.DateTimeUtil;
import dev.abelab.jphacks.util.CloudStorageUtil;
import dev.abelab.jphacks.property.SkywayProperty;
import dev.abelab.jphacks.exception.ErrorCode;
import dev.abelab.jphacks.exception.BaseException;
import dev.abelab.jphacks.exception.BadRequestException;
import dev.abelab.jphacks.exception.NotFoundException;
import dev.abelab.jphacks.exception.ConflictException;
import dev.abelab.jphacks.exception.ForbiddenException;
import dev.abelab.jphacks.exception.UnauthorizedException;

/**
 * RoomRestController Integration Test
 */
public class RoomRestController_IT extends AbstractRestController_IT {

	// API PATH
	static final String BASE_PATH = "/api/rooms";
	static final String GET_ROOM_PATH = BASE_PATH + "/%d";
	static final String GET_ROOMS_PATH = BASE_PATH;
	static final String CREATE_ROOM_PATH = BASE_PATH;
	static final String DELETE_ROOM_PATH = BASE_PATH + "/%d";
	static final String JOIN_ROOM_PATH = BASE_PATH + "/%d/join";
	static final String UNJOIN_ROOM_PATH = BASE_PATH + "/%d/unjoin";
	static final String AUTHENTICATE_ROOM_PATH = BASE_PATH + "/%d/authenticate";

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

	@Autowired
	SkywayProperty skywayProperty;

	@Mocked
	CloudStorageUtil cloudStorageUtil;

	/**
	 * ?????????????????????API????????????
	 */
	@Nested
	@TestInstance(PER_CLASS)
	class GetRoomTest extends AbstractRestControllerInitialization_IT {

		@Test
		void ???_????????????????????????() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var room = RoomSample.builder().ownerId(loginUser.getId()).build();
			roomMapper.insert(room);

			// ??????????????????
			final var users = Arrays.asList( //
				UserSample.builder().email(RandomUtil.generateEmail()).build(), //
				UserSample.builder().email(RandomUtil.generateEmail()).build() //
			);
			users.forEach(userMapper::insert);

			final var participations = Arrays.asList( //
				ParticipationSample.builder().userId(users.get(0).getId()).roomId(room.getId()).type(ParticipationTypeEnum.VIEWER.getId())
					.build(), //
				ParticipationSample.builder().userId(users.get(1).getId()).roomId(room.getId()).type(ParticipationTypeEnum.SPEAKER.getId())
					.speakerOrder(1).title(SAMPLE_STR).build());
			participations.forEach(participationMapper::insert);

			/*
			 * test
			 */
			final var request = getRequest(String.format(GET_ROOM_PATH, room.getId()));
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			final var response = execute(request, HttpStatus.OK, RoomResponse.class);

			/*
			 * verify
			 */
			assertThat(response) //
				.extracting(RoomResponse::getId, RoomResponse::getTitle, RoomResponse::getDescription,
					RoomResponse::getPresentationTimeLimit, RoomResponse::getQuestionTimeLimit, RoomResponse::getImageUrl) //
				.containsExactly(room.getId(), room.getTitle(), room.getDescription(), room.getPresentationTimeLimit(),
					room.getQuestionTimeLimit(), room.getImageUrl());

			// ????????????
			assertThat(response.getOwner()) //
				.extracting(UserResponse::getId, UserResponse::getEmail, UserResponse::getName) //
				.containsExactly(loginUser.getId(), loginUser.getEmail(), loginUser.getName());

			// ?????????
			assertThat(response.getSpeakers()) //
				.extracting(SpeakerResponse::getId, SpeakerResponse::getEmail, SpeakerResponse::getName, SpeakerResponse::getTitle) //
				.containsExactlyInAnyOrder(tuple(users.get(1).getId(), users.get(1).getEmail(), users.get(1).getName(), SAMPLE_STR));

			// ?????????
			assertThat(response.getViewers()) //
				.extracting(UserResponse::getId, UserResponse::getEmail, UserResponse::getName) //
				.containsExactlyInAnyOrder(tuple(users.get(0).getId(), users.get(0).getEmail(), users.get(0).getName()));
		}

		@Test
		void ???_???????????????????????????????????????() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			/*
			 * test & verify
			 */
			final var request = getRequest(String.format(GET_ROOM_PATH, SAMPLE_INT));
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, new NotFoundException(ErrorCode.NOT_FOUND_ROOM));
		}

		@Test
		void ???_????????????????????????() throws Exception {
			/*
			 * test & verify
			 */
			final var request = getRequest(String.format(GET_ROOM_PATH, SAMPLE_INT));
			request.header(HttpHeaders.AUTHORIZATION, "");
			execute(request, new UnauthorizedException(ErrorCode.INVALID_ACCESS_TOKEN));
		}

	}

	/**
	 * ?????????????????????API????????????
	 */
	@Nested
	@TestInstance(PER_CLASS)
	class GetRoomsTest extends AbstractRestControllerInitialization_IT {

		@Test
		void ???_????????????????????????() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var rooms = Arrays.asList( //
				RoomSample.builder().ownerId(loginUser.getId()).build(), //
				RoomSample.builder().ownerId(loginUser.getId()).build(), //
				RoomSample.builder().ownerId(loginUser.getId()).imageUrl(null).build() //
			);
			rooms.forEach(roomMapper::insert);

			// ??????????????????
			final var users = Arrays.asList( //
				UserSample.builder().email(RandomUtil.generateEmail()).build(), //
				UserSample.builder().email(RandomUtil.generateEmail()).build() //
			);
			users.forEach(userMapper::insert);

			final var participations = Arrays.asList( //
				// ?????????1
				ParticipationSample.builder().userId(users.get(0).getId()).roomId(rooms.get(0).getId())
					.type(ParticipationTypeEnum.VIEWER.getId()).build(), //
				ParticipationSample.builder().userId(users.get(1).getId()).roomId(rooms.get(0).getId())
					.type(ParticipationTypeEnum.SPEAKER.getId()).speakerOrder(1).title(SAMPLE_STR).build(), //
				// ?????????2
				ParticipationSample.builder().userId(users.get(0).getId()).roomId(rooms.get(1).getId())
					.type(ParticipationTypeEnum.SPEAKER.getId()).speakerOrder(1).title(SAMPLE_STR).build(), //
				ParticipationSample.builder().userId(users.get(1).getId()).roomId(rooms.get(1).getId())
					.type(ParticipationTypeEnum.SPEAKER.getId()).speakerOrder(2).title(null).build() //
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
				.extracting(RoomResponse::getId, RoomResponse::getTitle, RoomResponse::getDescription,
					RoomResponse::getPresentationTimeLimit, RoomResponse::getQuestionTimeLimit, RoomResponse::getImageUrl) //
				.containsExactlyElementsOf(rooms.stream().map(room -> tuple(room.getId(), room.getTitle(), room.getDescription(),
					room.getPresentationTimeLimit(), room.getQuestionTimeLimit(), room.getImageUrl())).collect(Collectors.toList()));

			// ????????????
			response.getRooms().forEach(room -> {
				assertThat(room.getOwner()) //
					.extracting(UserResponse::getId, UserResponse::getEmail, UserResponse::getName) //
					.containsExactly(loginUser.getId(), loginUser.getEmail(), loginUser.getName());
			});

			// ?????????
			assertThat(response.getRooms().get(0).getSpeakers()) //
				.extracting(SpeakerResponse::getId, SpeakerResponse::getEmail, SpeakerResponse::getName, SpeakerResponse::getTitle) //
				.containsExactlyInAnyOrder(tuple(users.get(1).getId(), users.get(1).getEmail(), users.get(1).getName(), SAMPLE_STR));
			assertThat(response.getRooms().get(1).getSpeakers()) //
				.extracting(SpeakerResponse::getId, SpeakerResponse::getEmail, SpeakerResponse::getName, SpeakerResponse::getTitle) //
				.containsExactlyInAnyOrder( //
					tuple(users.get(0).getId(), users.get(0).getEmail(), users.get(0).getName(), SAMPLE_STR),
					tuple(users.get(1).getId(), users.get(1).getEmail(), users.get(1).getName(), null));
			assertThat(response.getRooms().get(2).getSpeakers().size()).isEqualTo(0);

			// ?????????
			assertThat(response.getRooms().get(0).getViewers()) //
				.extracting(UserResponse::getId, UserResponse::getEmail, UserResponse::getName) //
				.containsExactlyInAnyOrder(tuple(users.get(0).getId(), users.get(0).getEmail(), users.get(0).getName()));
			assertThat(response.getRooms().get(1).getViewers().size()).isEqualTo(0);
			assertThat(response.getRooms().get(2).getViewers().size()).isEqualTo(0);
		}

		@Test
		void ???_????????????????????????() throws Exception {
			/*
			 * test & verify
			 */
			final var request = getRequest(GET_ROOMS_PATH);
			request.header(HttpHeaders.AUTHORIZATION, "");
			execute(request, new UnauthorizedException(ErrorCode.INVALID_ACCESS_TOKEN));
		}

	}

	/**
	 * ???????????????API????????????
	 */
	@Nested
	@TestInstance(PER_CLASS)
	class CreateRoomTest extends AbstractRestControllerInitialization_IT {

		@Test
		void ???_??????????????????() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var room = RoomSample.builder() //
				.presentationTimeLimit(300) //
				.questionTimeLimit(60) //
				.startAt(DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 10)) //
				.finishAt(DateTimeUtil.addDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 11)) //
				.build();
			final var requestBody = modelMapper.map(room, RoomCreateRequest.class);
			requestBody.setImage(SAMPLE_STR);

			final var imageUrl = "http://example.com/test_file.jpg";
			new Expectations() {
				{
					cloudStorageUtil.uploadFile((FileModel) any);
					result = imageUrl;
				}
			};

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
			}).stream().findFirst();
			assertThat(createdRoom.isPresent()).isTrue();
			assertThat(createdRoom.get())
				.extracting(Room::getTitle, Room::getDescription, Room::getOwnerId, Room::getPresentationTimeLimit,
					Room::getQuestionTimeLimit, Room::getImageUrl) //
				.containsExactly(requestBody.getTitle(), requestBody.getDescription(), loginUser.getId(),
					requestBody.getPresentationTimeLimit(), requestBody.getQuestionTimeLimit(), imageUrl);
			assertThat(createdRoom.get().getStartAt()).isInSameMinuteAs(room.getStartAt());
			assertThat(createdRoom.get().getFinishAt()).isInSameMinuteAs(room.getFinishAt());
		}

		@Test
		void ???_???????????????????????????NULL???????????????URL???NULL?????????() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var room = RoomSample.builder() //
				.presentationTimeLimit(300) //
				.questionTimeLimit(60) //
				.startAt(DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 10)) //
				.finishAt(DateTimeUtil.addDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 11)) //
				.build();
			final var requestBody = modelMapper.map(room, RoomCreateRequest.class);
			requestBody.setImage(null);

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
			}).stream().findFirst();
			assertThat(createdRoom.isPresent()).isTrue();
			assertThat(createdRoom.get().getImageUrl()).isNull();
		}

		@ParameterizedTest
		@MethodSource
		void ???_????????????????????????????????????(final Date date, final int startHour, final int finishHour, final BaseException expectedException)
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

		Stream<Arguments> ???_????????????????????????????????????() {
			return Stream.of( // ???????????????????????????????????????????????????????????????
				// ???????????????
				arguments(YESTERDAY, 10, 11, new BadRequestException(ErrorCode.PAST_ROOM_CANNOT_BE_CREATED)), //
				// ???????????????????????????????????????????????????????????????
				arguments(TOMORROW, 11, 10, new BadRequestException(ErrorCode.INVALID_ROOM_TIME)), //
				// ????????????????????????????????????
				arguments(TOMORROW, 10, 10, new BadRequestException(ErrorCode.INVALID_ROOM_TIME)) //
			);
		}

		@Test
		void ???_????????????????????????() throws Exception {
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

	/**
	 * ???????????????API????????????
	 */
	@Nested
	@TestInstance(PER_CLASS)
	class DeleteRoomTest extends AbstractRestControllerInitialization_IT {

		@Test
		void ???_??????????????????() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var room = RoomSample.builder() //
				.ownerId(loginUser.getId()) //
				.startAt(DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 10)) //
				.finishAt(DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 11)) //
				.build();
			roomMapper.insert(room);

			/*
			 * test
			 */
			final var request = deleteRequest(String.format(DELETE_ROOM_PATH, room.getId()));
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, HttpStatus.OK);

			/*
			 * verify
			 */
			final var deletedRoom = roomMapper.selectByPrimaryKey(room.getId());
			assertThat(deletedRoom).isNull();
		}

		@Test
		void ???_??????????????????????????????????????????() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var owner = UserSample.builder().build();
			userMapper.insert(owner);
			final var room = RoomSample.builder() //
				.ownerId(owner.getId()) //
				.startAt(DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 10)) //
				.finishAt(DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 11)) //
				.build();
			roomMapper.insert(room);

			/*
			 * test & verify
			 */
			final var request = deleteRequest(String.format(DELETE_ROOM_PATH, room.getId()));
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, new ForbiddenException(ErrorCode.USER_HAS_NO_PERMISSION));
		}

		@Test
		void ???_???????????????????????????????????????() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			/*
			 * test & verify
			 */
			final var request = deleteRequest(String.format(DELETE_ROOM_PATH, SAMPLE_INT));
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, new NotFoundException(ErrorCode.NOT_FOUND_ROOM));
		}

		@Test
		void ???_????????????????????????() throws Exception {
			/*
			 * test & verify
			 */
			final var request = deleteRequest(String.format(DELETE_ROOM_PATH, SAMPLE_INT));
			request.header(HttpHeaders.AUTHORIZATION, "");
			execute(request, new UnauthorizedException(ErrorCode.INVALID_ACCESS_TOKEN));
		}

	}

	/**
	 * ?????????????????????API????????????
	 */
	@Nested
	@TestInstance(PER_CLASS)
	class JoinRoomTest extends AbstractRestControllerInitialization_IT {

		@ParameterizedTest
		@MethodSource
		void ???_??????????????????????????????(final boolean isOwner, final ParticipationTypeEnum type, final String title) throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var user = UserSample.builder().build();
			userMapper.insert(user);
			final var owner = isOwner ? loginUser : user;

			final var room = RoomSample.builder() //
				.ownerId(owner.getId()) //
				.startAt(DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 10)) //
				.finishAt(DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 11)) //
				.build();
			roomMapper.insert(room);

			final var participations = Arrays.asList( //
				ParticipationSample.builder().userId(user.getId()).roomId(room.getId()).type(ParticipationTypeEnum.SPEAKER.getId()).build() //
			);
			participations.forEach(participationMapper::insert);

			final var requestBody = RoomJoinRequest.builder() //
				.type(type.getId()) //
				.title(title) //
				.build();

			/*
			 * test
			 */
			final var request = postRequest(String.format(JOIN_ROOM_PATH, room.getId()), requestBody);
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, HttpStatus.CREATED);

			/*
			 * verify
			 */
			final var participation = participationMapper.selectByExample(new ParticipationExample() {
				{
					createCriteria().andRoomIdEqualTo(room.getId());
				}
			}).stream().findFirst();
			assertThat(participation.isPresent()).isTrue();
			assertThat(participation.get()) //
				.extracting(Participation::getType, Participation::getTitle, Participation::getSpeakerOrder) //
				.containsExactly(requestBody.getType(), requestBody.getTitle(), participations.size() + 1);
		}

		Stream<Arguments> ???_??????????????????????????????() {
			return Stream.of( // ????????????????????????????????????????????????????????????
				arguments(true, ParticipationTypeEnum.SPEAKER, SAMPLE_STR), //
				arguments(true, ParticipationTypeEnum.SPEAKER, null), //
				arguments(true, ParticipationTypeEnum.VIEWER, null), //
				arguments(false, ParticipationTypeEnum.SPEAKER, SAMPLE_STR), //
				arguments(false, ParticipationTypeEnum.SPEAKER, null), //
				arguments(false, ParticipationTypeEnum.VIEWER, null) //
			);
		}

		@Test
		void ???_?????????????????????????????????????????????() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var room = RoomSample.builder() //
				.ownerId(loginUser.getId()) //
				.startAt(DateTimeUtil.editDateTime(YESTERDAY, Calendar.HOUR_OF_DAY, 10)) //
				.finishAt(DateTimeUtil.editDateTime(YESTERDAY, Calendar.HOUR_OF_DAY, 11)) //
				.build();
			roomMapper.insert(room);

			final var requestBody = RoomJoinRequest.builder() //
				.type(ParticipationTypeEnum.VIEWER.getId()) //
				.title(null) //
				.build();

			/*
			 * test & verify
			 */
			final var request = postRequest(String.format(JOIN_ROOM_PATH, room.getId()), requestBody);
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, new BadRequestException(ErrorCode.CANNOT_JOIN_PAST_ROOM));
		}

		@Test
		void ???_???????????????????????????????????????????????????() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var room = RoomSample.builder() //
				.ownerId(loginUser.getId()) //
				.startAt(DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 10)) //
				.finishAt(DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 11)) //
				.build();
			roomMapper.insert(room);

			final var requestBody = RoomJoinRequest.builder() //
				.type(ParticipationTypeEnum.VIEWER.getId()) //
				.title(null) //
				.build();

			/*
			 * test & verify
			 */
			final var request = postRequest(String.format(JOIN_ROOM_PATH, room.getId()), requestBody);
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, HttpStatus.CREATED);
			execute(request, new ConflictException(ErrorCode.ALREADY_JOIN_ROOM));
		}

		@Test
		void ???_?????????????????????????????????????????????() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var requestBody = RoomJoinRequest.builder() //
				.type(ParticipationTypeEnum.VIEWER.getId()) //
				.title(null) //
				.build();

			/*
			 * test & verify
			 */
			final var request = postRequest(String.format(JOIN_ROOM_PATH, SAMPLE_INT), requestBody);
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, new NotFoundException(ErrorCode.NOT_FOUND_ROOM));
		}

		@ParameterizedTest
		@MethodSource
		void ???????????????????????????????????????(final int typeId, final BaseException expectedException) throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var room = RoomSample.builder() //
				.ownerId(loginUser.getId()) //
				.startAt(DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 10)) //
				.finishAt(DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 11)) //
				.build();
			roomMapper.insert(room);

			final var requestBody = RoomJoinRequest.builder() //
				.type(typeId) //
				.title(SAMPLE_STR) //
				.build();

			/*
			 * test
			 */
			final var request = postRequest(String.format(JOIN_ROOM_PATH, room.getId()), requestBody);
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			if (expectedException == null) {
				execute(request, HttpStatus.CREATED);
			} else {
				execute(request, expectedException);
			}
		}

		Stream<Arguments> ???????????????????????????????????????() {
			return Stream.of( // ???????????????ID????????????????????????
				// ??????
				arguments(1, null), //
				arguments(2, null), //
				// ??????????????????????????????
				arguments(0, new NotFoundException(ErrorCode.NOT_FOUND_PARTICIPATION_TYPE)), //
				arguments(3, new NotFoundException(ErrorCode.NOT_FOUND_PARTICIPATION_TYPE)) //
			);
		}

		@Test
		void ???_????????????????????????() throws Exception {
			/*
			 * given
			 */
			final var requestBody = RoomJoinRequest.builder().type(ParticipationTypeEnum.VIEWER.getId()).build();

			/*
			 * test & verify
			 */
			final var request = postRequest(String.format(JOIN_ROOM_PATH, SAMPLE_INT), requestBody);
			request.header(HttpHeaders.AUTHORIZATION, "");
			execute(request, new UnauthorizedException(ErrorCode.INVALID_ACCESS_TOKEN));
		}

	}

	/**
	 * ?????????????????????API????????????
	 */
	@Nested
	@TestInstance(PER_CLASS)
	class UnjoinRoomTest extends AbstractRestControllerInitialization_IT {

		@Test
		void ???_??????????????????????????????() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var room = RoomSample.builder() //
				.ownerId(loginUser.getId()) //
				.startAt(DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 10)) //
				.finishAt(DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 11)) //
				.build();
			roomMapper.insert(room);

			final var participation = ParticipationSample.builder() //
				.userId(loginUser.getId()) //
				.roomId(room.getId()) //
				.build();
			participationMapper.insert(participation);

			/*
			 * test
			 */
			final var request = postRequest(String.format(UNJOIN_ROOM_PATH, room.getId()));
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, HttpStatus.OK);

			/*
			 * verify
			 */
			final var deletedParticipation = participationMapper.selectByPrimaryKey(loginUser.getId(), room.getId());
			assertThat(deletedParticipation).isNull();
		}

		@Test
		void ???_?????????????????????????????????????????????????????????() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var room = RoomSample.builder() //
				.ownerId(loginUser.getId()) //
				.startAt(DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 10)) //
				.finishAt(DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 11)) //
				.build();
			roomMapper.insert(room);

			/*
			 * test & verify
			 */
			final var request = postRequest(String.format(UNJOIN_ROOM_PATH, room.getId()));
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, new NotFoundException(ErrorCode.NOT_FOUND_PARTICIPATION));
		}

		@Test
		void ???_?????????????????????????????????????????????() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var room = RoomSample.builder() //
				.ownerId(loginUser.getId()) //
				.startAt(DateTimeUtil.editDateTime(YESTERDAY, Calendar.HOUR_OF_DAY, 10)) //
				.finishAt(DateTimeUtil.editDateTime(YESTERDAY, Calendar.HOUR_OF_DAY, 11)) //
				.build();
			roomMapper.insert(room);

			/*
			 * test & verify
			 */
			final var request = postRequest(String.format(UNJOIN_ROOM_PATH, room.getId()));
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, new BadRequestException(ErrorCode.CANNOT_UNJOIN_PAST_ROOM));
		}

		@Test
		void ???_?????????????????????????????????????????????() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			/*
			 * test & verify
			 */
			final var request = postRequest(String.format(UNJOIN_ROOM_PATH, SAMPLE_INT));
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, new NotFoundException(ErrorCode.NOT_FOUND_ROOM));
		}

		@Test
		void ???_????????????????????????() throws Exception {
			/*
			 * test & verify
			 */
			final var request = postRequest(String.format(UNJOIN_ROOM_PATH, SAMPLE_INT));
			request.header(HttpHeaders.AUTHORIZATION, "");
			execute(request, new UnauthorizedException(ErrorCode.INVALID_ACCESS_TOKEN));
		}

	}

	/**
	 * ???????????????API????????????
	 */
	@Nested
	@TestInstance(PER_CLASS)
	class AuthenticateRoomTest extends AbstractRestControllerInitialization_IT {

		@ParameterizedTest
		@MethodSource
		void ???_????????????????????????(final ParticipationTypeEnum type, final Date startAt, final Date finishAt) throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var room = RoomSample.builder() //
				.ownerId(loginUser.getId()) //
				.startAt(startAt) //
				.finishAt(finishAt) //
				.build();
			roomMapper.insert(room);

			final var participation = ParticipationSample.builder() //
				.userId(loginUser.getId()) //
				.roomId(room.getId()) //
				.type(type.getId()) //
				.build();
			participationMapper.insert(participation);

			final var requestBody = RoomAuthenticateRequest.builder().peerId(SAMPLE_STR).build();

			/*
			 * test
			 */
			final var request = postRequest(String.format(AUTHENTICATE_ROOM_PATH, room.getId()), requestBody);
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			final var response = execute(request, HttpStatus.OK, RoomCredentialsResponse.class);

			/*
			 * verify
			 */
			assertThat(response.getType()).isEqualTo(type.getId());
			assertThat(response.getSkyway()) //
				.extracting(SkywayCredentialsModel::getTtl, SkywayCredentialsModel::getPeerId) //
				.containsExactly(skywayProperty.getTtl(), requestBody.getPeerId());
			assertThat(response.getSkyway().getAuthToken()).isNotNull();
			assertThat(response.getSkyway().getTimestamp()).isNotNull();
			assertThat(response.getSkyway().getPeerId()).isEqualTo(requestBody.getPeerId());
		}

		Stream<Arguments> ???_????????????????????????() {
			return Stream.of( // ?????????????????????????????????????????????
				arguments(ParticipationTypeEnum.SPEAKER, DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 10),
					DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 10)), //
				arguments(ParticipationTypeEnum.VIEWER, DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 10),
					DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 10)), //
				arguments(ParticipationTypeEnum.VIEWER, DateTimeUtil.editDateTime(YESTERDAY, Calendar.HOUR_OF_DAY, 10),
					DateTimeUtil.editDateTime(YESTERDAY, Calendar.HOUR_OF_DAY, 10)), //
				arguments(ParticipationTypeEnum.VIEWER, DateTimeUtil.editDateTime(YESTERDAY, Calendar.HOUR_OF_DAY, 10),
					DateTimeUtil.editDateTime(TOMORROW, Calendar.HOUR_OF_DAY, 10)) //
			);
		}

		@Test
		void ???_???????????????????????????????????????????????????() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var room = RoomSample.builder() //
				.ownerId(loginUser.getId()) //
				.startAt(DateTimeUtil.editDateTime(YESTERDAY, Calendar.HOUR_OF_DAY, 10)) //
				.finishAt(DateTimeUtil.editDateTime(YESTERDAY, Calendar.HOUR_OF_DAY, 11)) //
				.build();
			roomMapper.insert(room);

			final var requestBody = RoomAuthenticateRequest.builder().peerId(SAMPLE_STR).build();

			/*
			 * test & verify
			 */
			final var request = postRequest(String.format(AUTHENTICATE_ROOM_PATH, room.getId()), requestBody);
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, new ForbiddenException(ErrorCode.CANNOT_AUTHENTICATE_NOT_JOINED_ROOM));
		}

		@Test
		void ???_???????????????????????????????????????() throws Exception {
			/*
			 * given
			 */
			final var loginUser = createLoginUser(true);
			final var credentials = getLoginUserCredentials(loginUser);

			final var requestBody = RoomAuthenticateRequest.builder().peerId(SAMPLE_STR).build();

			/*
			 * test & verify
			 */
			final var request = postRequest(String.format(AUTHENTICATE_ROOM_PATH, SAMPLE_INT), requestBody);
			request.header(HttpHeaders.AUTHORIZATION, credentials);
			execute(request, new NotFoundException(ErrorCode.NOT_FOUND_ROOM));
		}

		@Test
		void ???_????????????????????????() throws Exception {
			/*
			 * given
			 */
			final var requestBody = RoomAuthenticateRequest.builder().peerId(SAMPLE_STR).build();

			/*
			 * test & verify
			 */
			final var request = postRequest(String.format(AUTHENTICATE_ROOM_PATH, SAMPLE_INT), requestBody);
			request.header(HttpHeaders.AUTHORIZATION, "");
			execute(request, new UnauthorizedException(ErrorCode.INVALID_ACCESS_TOKEN));
		}

	}

}
