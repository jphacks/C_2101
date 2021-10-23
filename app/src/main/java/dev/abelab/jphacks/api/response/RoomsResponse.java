package dev.abelab.jphacks.api.response;

import java.util.List;

import lombok.*;

/**
 * ルーム一覧レスポンス
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomsResponse {

    /**
     * ルーム一覧
     */
    List<RoomResponse> rooms;

}
