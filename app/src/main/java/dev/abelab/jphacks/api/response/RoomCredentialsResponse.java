package dev.abelab.jphacks.api.response;

import lombok.*;

/**
 * ルームのクレデンシャルレスポンス
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomCredentialsResponse {

    /**
     * 参加タイプ
     */
    Integer type;

    /**
     * SkyWay credentials
     */
    SkywayCredentialsResponse skyway;

}
