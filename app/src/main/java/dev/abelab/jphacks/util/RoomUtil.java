package dev.abelab.jphacks.util;

import java.util.Date;

import dev.abelab.jphacks.db.entity.Room;

public class RoomUtil {

    /**
     * 過去のルームかチェック
     *
     * @param room ルーム
     *
     * @return 過去のルームかどうか
     */
    public static boolean isPastRoom(final Room room) {
        final var now = new Date();
        return now.after(room.getStartAt()) || now.after(room.getFinishAt());
    }

}
