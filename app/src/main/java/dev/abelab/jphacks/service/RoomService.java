package dev.abelab.jphacks.service;

import java.util.Date;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.modelmapper.ModelMapper;

import lombok.*;
import dev.abelab.jphacks.api.request.RoomCreateRequest;
import dev.abelab.jphacks.api.request.RoomJoinRequest;
import dev.abelab.jphacks.api.response.UserResponse;
import dev.abelab.jphacks.api.response.SpeakerResponse;
import dev.abelab.jphacks.api.response.RoomsResponse;
import dev.abelab.jphacks.api.response.RoomResponse;
import dev.abelab.jphacks.db.entity.User;
import dev.abelab.jphacks.db.entity.Room;
import dev.abelab.jphacks.db.entity.Participation;
import dev.abelab.jphacks.enums.ParticipationTypeEnum;
import dev.abelab.jphacks.repository.UserRepository;
import dev.abelab.jphacks.repository.RoomRepository;
import dev.abelab.jphacks.repository.ParticipationRepository;
import dev.abelab.jphacks.util.RoomUtil;
import dev.abelab.jphacks.exception.ErrorCode;
import dev.abelab.jphacks.exception.BadRequestException;
import dev.abelab.jphacks.exception.ForbiddenException;

@RequiredArgsConstructor
@Service
public class RoomService {

    private final ModelMapper modelMapper;

    private final UserRepository userRepository;

    private final RoomRepository roomRepository;

    private final ParticipationRepository participationRepository;

    /**
     * ルーム一覧を取得
     *
     * @param loginUser ログインユーザ
     *
     * @return ルーム一覧レスポンス
     */
    @Transactional
    public RoomsResponse getRooms(final User loginUser) {
        // ルーム一覧の取得
        final var rooms = this.roomRepository.selectAll();
        final var roomResponses = rooms.stream() //
            .map(room -> {
                // オーナーを取得
                final var owner = this.userRepository.selectById(room.getOwnerId());

                // 参加者リストを取得
                final var participations = this.participationRepository.selectWithUserByRoomId(room.getId());
                final var speakers = participations.stream() //
                    .filter(participation -> participation.getType() == ParticipationTypeEnum.SPEAKER.getId()) //
                    .sorted((p1, p2) -> p1.getSpeakerOrder().compareTo(p2.getSpeakerOrder())) //
                    .map(participation -> {
                        final var result = this.modelMapper.map(participation.getUser(), SpeakerResponse.class);
                        result.setTitle(participation.getTitle());
                        result.setSpeakerOrder(participation.getSpeakerOrder());
                        return result;
                    }) //
                    .collect(Collectors.toList());
                final var viewers = participations.stream() //
                    .filter(participation -> participation.getType() == ParticipationTypeEnum.VIEWER.getId()) //
                    .map(participation -> this.modelMapper.map(participation.getUser(), UserResponse.class)) //
                    .collect(Collectors.toList());

                final var result = this.modelMapper.map(room, RoomResponse.class);
                result.setOwner(this.modelMapper.map(owner, UserResponse.class));
                result.setSpeakers(speakers);
                result.setViewers(viewers);

                return result;
            }).collect(Collectors.toList());

        return new RoomsResponse(roomResponses);
    }

    /**
     * ルームを作成
     *
     * @param requestBody ルーム作成リクエスト
     * @param loginUser   ログインユーザ
     */
    @Transactional
    public void createRoom(final RoomCreateRequest requestBody, final User loginUser) {
        // 開催日時のバリデーション
        // 過去の開催日時
        final var now = new Date();
        if (now.after(requestBody.getStartAt()) || now.after(requestBody.getFinishAt())) {
            throw new BadRequestException(ErrorCode.PAST_ROOM_CANNOT_BE_CREATED);
        }
        // 開始時刻よりも前に終了時刻が設定されている
        if (requestBody.getStartAt().after(requestBody.getFinishAt())) {
            throw new BadRequestException(ErrorCode.INVALID_ROOM_TIME);
        }
        // 開始時刻と終了時刻が同じ
        if (requestBody.getStartAt().equals(requestBody.getFinishAt())) {
            throw new BadRequestException(ErrorCode.INVALID_ROOM_TIME);
        }

        // ルームを作成
        final var room = this.modelMapper.map(requestBody, Room.class);
        room.setOwnerId(loginUser.getId());
        this.roomRepository.insert(room);
    }

    /**
     * ルームを削除
     *
     * @param roomId    ルームID
     * @param loginUser ログインユーザ
     */
    @Transactional
    public void deleteRoom(final int roomId, final User loginUser) {
        // ルームを取得
        final var room = this.roomRepository.selectById(roomId);

        // 削除権限をチェック
        if (room.getOwnerId() != loginUser.getId()) {
            throw new ForbiddenException(ErrorCode.USER_HAS_NO_PERMISSION);
        }

        // ルームを削除
        this.roomRepository.deleteById(roomId);
    }

    /**
     * ルームの参加登録
     *
     * @param roomId      ルームID
     * @param requestBody ルーム参加登録リクエスト
     * @param loginUser   ログインユーザ
     */
    @Transactional
    public void joinRoom(final int roomId, final RoomJoinRequest requestBody, final User loginUser) {
        // ルームを取得
        final var room = this.roomRepository.selectById(roomId);

        // 参加登録可能な日時かチェック
        if (RoomUtil.isPastRoom(room)) {
            throw new BadRequestException(ErrorCode.CANNOT_JOIN_PAST_ROOM);
        }

        // 発表順を求める
        final var speakerOrder = this.participationRepository.selectByRoomId(room.getId()).stream() //
            .filter(participation -> participation.getType() == ParticipationTypeEnum.SPEAKER.getId()) //
            .mapToInt(Participation::getSpeakerOrder).max().orElse(0) + 1;

        // 参加情報を作成
        final var participation = Participation.builder() //
            .userId(loginUser.getId()) //
            .roomId(room.getId()) //
            .type(requestBody.getType()) //
            .title(requestBody.getTitle()) //
            .speakerOrder(speakerOrder) //
            .build();
        this.participationRepository.insert(participation);
    }

    /**
     * ルームの参加辞退
     *
     * @param roomId    ルームID
     * @param loginUser ログインユーザ
     */
    @Transactional
    public void unjoinRoom(final int roomId, final User loginUser) {
        // ルームを取得
        final var room = this.roomRepository.selectById(roomId);

        // 参加辞退可能な日時かチェック
        if (RoomUtil.isPastRoom(room)) {
            throw new BadRequestException(ErrorCode.CANNOT_UNJOIN_PAST_ROOM);
        }

        // 参加情報を削除
        this.participationRepository.deleteByRoomIdAndUserId(room.getId(), loginUser.getId());
    }

}
