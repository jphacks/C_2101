package dev.abelab.jphacks.api.response;

import lombok.*;
import dev.abelab.jphacks.model.SkywayCredentialsModel;

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
    SkywayCredentialsModel skyway;

}
