package dev.abelab.jphacks.service;

import java.time.Instant;
import java.util.Date;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.apache.commons.net.util.Base64;
import org.modelmapper.ModelMapper;

import lombok.*;
import dev.abelab.jphacks.api.request.RoomCreateRequest;
import dev.abelab.jphacks.api.request.RoomJoinRequest;
import dev.abelab.jphacks.api.request.RoomAuthenticateRequest;
import dev.abelab.jphacks.api.response.RoomsResponse;
import dev.abelab.jphacks.api.response.RoomResponse;
import dev.abelab.jphacks.api.response.RoomCredentialsResponse;
import dev.abelab.jphacks.db.entity.User;
import dev.abelab.jphacks.db.entity.Room;
import dev.abelab.jphacks.db.entity.Participation;
import dev.abelab.jphacks.model.FileModel;
import dev.abelab.jphacks.model.SkywayCredentialsModel;
import dev.abelab.jphacks.enums.ParticipationTypeEnum;
import dev.abelab.jphacks.repository.RoomRepository;
import dev.abelab.jphacks.repository.ParticipationRepository;
import dev.abelab.jphacks.logic.RoomLogic;
import dev.abelab.jphacks.util.RoomUtil;
import dev.abelab.jphacks.util.AuthUtil;
import dev.abelab.jphacks.util.CloudStorageUtil;
import dev.abelab.jphacks.property.SkywayProperty;
import dev.abelab.jphacks.exception.ErrorCode;
import dev.abelab.jphacks.exception.BadRequestException;
import dev.abelab.jphacks.exception.ForbiddenException;

@RequiredArgsConstructor
@Service
public class RoomService {

    private final ModelMapper modelMapper;

    private final RoomRepository roomRepository;

    private final ParticipationRepository participationRepository;

    private final RoomLogic roomLogic;

    private final SkywayProperty skywayProperty;

    private final CloudStorageUtil cloudStorageUtil;

    /**
     * ルームを取得
     *
     * @param roomId    ルームID
     * @param loginUser ログインユーザ
     *
     * @return ルームレスポンス
     */
    @Transactional
    public RoomResponse getRoom(final int roomId, final User loginUser) {
        // ルームを取得
        final var room = this.roomRepository.selectById(roomId);

        return this.roomLogic.getRoomResponse(room);
    }

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
        final var roomResponses = rooms.stream().map(this.roomLogic::getRoomResponse).collect(Collectors.toList());

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

        // アイコンをアップロード
        String imageUrl = null;
        if (requestBody.getImage() != null) {
            final var file = FileModel.builder().content(Base64.decodeBase64(requestBody.getImage())).build();
            file.setName("rooms/" + file.getName());
            imageUrl = this.cloudStorageUtil.uploadFile(file);
        }

        // ルームを作成
        final var room = this.modelMapper.map(requestBody, Room.class);
        room.setOwnerId(loginUser.getId());
        room.setImageUrl(imageUrl);
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

        // 発表タイプ
        final var type = ParticipationTypeEnum.findById(requestBody.getType());

        // 参加情報を作成
        final var participation = Participation.builder() //
            .userId(loginUser.getId()) //
            .roomId(room.getId()) //
            .type(type.getId()) //
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

    /**
     * ルームの認証
     *
     * @param roomId      ルームID
     * @param requestBody ルーム認証リクエスト
     * @param loginUser   ログインユーザ
     *
     * @return ルームのクレデンシャルレスポンス
     */
    @Transactional
    public RoomCredentialsResponse authenticateRoom(final int roomId, final RoomAuthenticateRequest requestBody, final User loginUser) {
        // ルームを取得
        this.roomRepository.selectById(roomId);

        // 参加登録済みか
        if (!this.participationRepository.existsByRoomIdAndUserId(roomId, loginUser.getId())) {
            throw new ForbiddenException(ErrorCode.CANNOT_AUTHENTICATE_NOT_JOINED_ROOM);
        }

        // SkyWayクレデンシャルを取得
        final var participation = this.participationRepository.selectByRoomIdAndUserId(roomId, loginUser.getId());
        final var ttl = this.skywayProperty.getTtl();
        final var timestamp = (int) Instant.now().getEpochSecond();
        final var authToken = AuthUtil.hmacSHA256( //
            String.format("%d:%d:%s", timestamp, ttl, requestBody.getPeerId()), //
            this.skywayProperty.getSecret());

        final var skywayCredentials = SkywayCredentialsModel.builder() //
            .peerId(requestBody.getPeerId()) //
            .authToken(authToken) //
            .ttl(ttl) //
            .timestamp(timestamp) //
            .build();

        return RoomCredentialsResponse.builder() //
            .type(participation.getType()) //
            .skyway(skywayCredentials) //
            .build();
    }

}
