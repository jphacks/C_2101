package dev.abelab.jphacks.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import dev.abelab.jphacks.db.entity.Room;
import dev.abelab.jphacks.db.entity.RoomExample;
import dev.abelab.jphacks.db.mapper.RoomMapper;
import dev.abelab.jphacks.exception.ErrorCode;
import dev.abelab.jphacks.exception.NotFoundException;

@RequiredArgsConstructor
@Repository
public class RoomRepository {

    private final RoomMapper roomMapper;

    /**
     * ルーム一覧を取得
     *
     * @return ルーム一覧
     */
    public List<Room> selectAll() {
        final var example = new RoomExample();
        return this.roomMapper.selectByExampleWithBLOBs(example);
    }

    /**
     * ルームを作成
     *
     * @param room ルーム
     *
     * @return ルームID
     */
    public int insert(final Room room) {
        return this.roomMapper.insertSelective(room);
    }

    /**
     * ルームを削除
     *
     * @param roomId ルームID
     */
    public void deleteById(final int roomId) {
        if (this.existsById(roomId)) {
            this.roomMapper.deleteByPrimaryKey(roomId);
        } else {
            throw new NotFoundException(ErrorCode.NOT_FOUND_ROOM);
        }
    }

    /**
     * IDからルームを検索
     *
     * @param roomId ルームID
     *
     * @return ルーム
     */
    public Room selectById(final int roomId) {
        return Optional.ofNullable(this.roomMapper.selectByPrimaryKey(roomId)) //
            .orElseThrow(() -> new NotFoundException(ErrorCode.NOT_FOUND_ROOM));
    }

    /**
     * ルームIDの存在確認
     *
     * @param roomId ルームID
     *
     * @return ルームIDが存在するか
     */
    public boolean existsById(final int roomId) {
        try {
            this.selectById(roomId);
            return true;
        } catch (NotFoundException e) {
            return false;
        }
    }

}
