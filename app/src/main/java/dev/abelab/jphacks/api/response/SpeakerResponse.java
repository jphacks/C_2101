package dev.abelab.jphacks.api.response;

import lombok.*;

/**
 * 登壇者レスポンス
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SpeakerResponse {

    /**
     * ユーザID
     */
    Integer id;

    /**
     * メールアドレス
     */
    String email;

    /**
     * ユーザ名
     */
    String name;

    /**
     * アイコンURL
     */
    String iconUrl;

    /**
     * 発表タイトル
     */
    String title;

    /**
     * 発表順
     */
    Integer speakerOrder;

}
