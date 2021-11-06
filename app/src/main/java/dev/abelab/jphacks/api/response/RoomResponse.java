package dev.abelab.jphacks.api.response;

import java.util.List;
import java.util.Date;

import lombok.*;

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
     * 発表の制限時間[s]
     */
    Integer presentationTimeLimit;

    /**
     * 質疑応答の制限時間[s]
     */
    Integer questionTimeLimit;

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
    List<SpeakerResponse> speakers;

    /**
     * 閲覧者リスト
     */
    List<UserResponse> viewers;

    /**
     * アイキャッチ画像URL
     */
    String imageUrl;

}
