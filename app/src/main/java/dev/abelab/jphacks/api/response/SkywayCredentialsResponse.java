package dev.abelab.jphacks.api.response;

import lombok.*;

/**
 * SkyWayクレデンシャルレスポンス
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SkywayCredentialsResponse {

    /**
     * 認証トークン
     */
    String authToken;

    /**
     * トークンの有効期限
     */
    Integer ttl;

    /**
     * タイムスタンプ
     */
    Integer timestamp;

}
