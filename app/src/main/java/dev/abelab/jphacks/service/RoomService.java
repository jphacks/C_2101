package dev.abelab.jphacks.service;

import java.util.Date;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.modelmapper.ModelMapper;

import lombok.*;
import dev.abelab.jphacks.api.request.RoomCreateRequest;
import dev.abelab.jphacks.api.response.UserResponse;
import dev.abelab.jphacks.api.response.SpeakerResponse;
import dev.abelab.jphacks.api.response.RoomsResponse;
import dev.abelab.jphacks.api.response.RoomResponse;
import dev.abelab.jphacks.db.entity.User;
import dev.abelab.jphacks.db.entity.Room;
import dev.abelab.jphacks.enums.ParticipationTypeEnum;
import dev.abelab.jphacks.repository.UserRepository;
import dev.abelab.jphacks.repository.RoomRepository;
import dev.abelab.jphacks.repository.ParticipationRepository;
import dev.abelab.jphacks.exception.ErrorCode;
import dev.abelab.jphacks.exception.BadRequestException;

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
                    .map(participation -> {
                        final var result = this.modelMapper.map(participation.getUser(), SpeakerResponse.class);
                        result.setTitle(participation.getTitle());
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

}
