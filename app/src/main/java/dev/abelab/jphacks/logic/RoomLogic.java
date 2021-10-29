package dev.abelab.jphacks.logic;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import org.modelmapper.ModelMapper;

import lombok.*;
import dev.abelab.jphacks.api.response.UserResponse;
import dev.abelab.jphacks.api.response.RoomResponse;
import dev.abelab.jphacks.api.response.SpeakerResponse;
import dev.abelab.jphacks.db.entity.Room;
import dev.abelab.jphacks.enums.ParticipationTypeEnum;
import dev.abelab.jphacks.repository.UserRepository;
import dev.abelab.jphacks.repository.ParticipationRepository;

@RequiredArgsConstructor
@Component
public class RoomLogic {

    private final ModelMapper modelMapper;

    private final UserRepository userRepository;

    private final ParticipationRepository participationRepository;

    /**
     * ルームからルームレスポンスを取得
     *
     * @param room ルーム
     *
     * @return ルームレスポンス
     */
    public RoomResponse getRoomResponse(final Room room) {
        // オーナーを取得
        final var owner = this.userRepository.selectById(room.getOwnerId());

        // 参加者リストを取得
        final var participations = this.participationRepository.selectWithUserByRoomId(room.getId());

        // 登壇者リストを取得
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

        // 閲覧者リストを取得
        final var viewers = participations.stream() //
            .filter(participation -> participation.getType() == ParticipationTypeEnum.VIEWER.getId()) //
            .map(participation -> this.modelMapper.map(participation.getUser(), UserResponse.class)) //
            .collect(Collectors.toList());

        final var roomResponse = this.modelMapper.map(room, RoomResponse.class);
        roomResponse.setOwner(this.modelMapper.map(owner, UserResponse.class));
        roomResponse.setSpeakers(speakers);
        roomResponse.setViewers(viewers);

        return roomResponse;

    }
}
