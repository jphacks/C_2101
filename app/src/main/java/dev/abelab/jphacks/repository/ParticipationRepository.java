package dev.abelab.jphacks.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import dev.abelab.jphacks.db.entity.Participation;
import dev.abelab.jphacks.db.entity.ParticipationExample;
import dev.abelab.jphacks.db.entity.join.ParticipationWithUser;
import dev.abelab.jphacks.db.mapper.ParticipationMapper;
import dev.abelab.jphacks.exception.ErrorCode;
import dev.abelab.jphacks.exception.NotFoundException;
import dev.abelab.jphacks.exception.ConflictException;

@RequiredArgsConstructor
@Repository
public class ParticipationRepository {

    private final ParticipationMapper participationMapper;

    /**
     * ルームIDから参加情報リストを取得
     *
     * @param roomId ルームID
     *
     * @return 参加情報リスト
     */
    public List<Participation> selectByRoomId(final int roomId) {
        final var example = new ParticipationExample();
        example.createCriteria().andRoomIdEqualTo(roomId);
        return this.participationMapper.selectByExample(example);
    }

    /**
     * ルームIDから参加情報(+ユーザ)リストを取得
     *
     * @param roomId ルームID
     *
     * @return 参加情報(+ユーザ)リスト
     */
    public List<ParticipationWithUser> selectWithUserByRoomId(final int roomId) {
        return this.participationMapper.selectWithUserByRoomId(roomId);
    }

    /**
     * 参加情報を作成
     *
     * @param participation 参加情報
     *
     * @return 参加情報ID
     */
    public int insert(final Participation participation) {
        if (this.existsByRoomIdAndUserId(participation.getRoomId(), participation.getUserId())) {
            throw new ConflictException(ErrorCode.ALREADY_JOIN_ROOM);
        }
        return this.participationMapper.insert(participation);
    }

    /**
     * ルームID・ユーザIDの存在確認
     *
     * @param roomId ルームID
     * @param userId ユーザID
     *
     * @return ルームID・ユーザIDが存在するか
     */
    public boolean existsByRoomIdAndUserId(final int roomId, final int userId) {
        final var participation = this.participationMapper.selectByPrimaryKey(userId, roomId);
        return participation != null;
    }

    /**
     * ルームID・ユーザIDから参加情報を削除
     *
     * @param roomId ルームID
     * @param userId ユーザID
     */
    public void deleteByRoomIdAndUserId(final int roomId, final int userId) {
        if (!this.existsByRoomIdAndUserId(roomId, userId)) {
            throw new NotFoundException(ErrorCode.NOT_FOUND_PARTICIPATION);
        }
        this.participationMapper.deleteByPrimaryKey(userId, roomId);
    }

}
