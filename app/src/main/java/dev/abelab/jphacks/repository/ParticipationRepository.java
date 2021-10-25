package dev.abelab.jphacks.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import dev.abelab.jphacks.db.entity.Participation;
import dev.abelab.jphacks.db.entity.ParticipationExample;
import dev.abelab.jphacks.db.entity.join.ParticipationWithUser;
import dev.abelab.jphacks.db.mapper.ParticipationMapper;

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
        return this.participationMapper.insert(participation);
    }

}
