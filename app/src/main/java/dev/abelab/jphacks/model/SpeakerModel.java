package dev.abelab.jphacks.model;

import lombok.*;

/**
 * 登壇者モデル
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SpeakerModel {

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

}
