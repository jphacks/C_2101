package dev.abelab.jphacks.api.request;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.*;

/**
 * ルーム参加登録リクエスト
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomJoinRequest {

    /**
     * タイトル
     */
    @NotNull
    @Size(max = 255)
    String title;

    /**
     * 参加タイプ
     */
    @NotNull
    Integer type;

}
