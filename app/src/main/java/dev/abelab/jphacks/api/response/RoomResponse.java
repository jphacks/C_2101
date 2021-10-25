package dev.abelab.jphacks.api.response;

import java.util.List;
import java.util.Date;

import lombok.*;
import dev.abelab.jphacks.model.SpeakerModel;

/**
 * ルーム情報レスポンス
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomResponse {

    /**
     * ルームID
     */
    Integer id;

    /**
     * タイトル
     */
    String title;

    /**
     * 説明文
     */
    String description;

    /**
     * オーナー
     */
    UserResponse owner;

    /**
     * 開始日時
     */
    Date startAt;

    /**
     * 終了日時
     */
    Date finishAt;

    /**
     * 登壇者リスト
     */
    List<SpeakerModel> speakers;

    /**
     * 閲覧者リスト
     */
    List<UserResponse> viewers;

}
