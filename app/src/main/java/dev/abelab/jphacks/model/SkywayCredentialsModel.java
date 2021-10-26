package dev.abelab.jphacks.model;

import lombok.*;

/**
 * SkyWayのクレデンシャルモデル
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SkywayCredentialsModel {

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
