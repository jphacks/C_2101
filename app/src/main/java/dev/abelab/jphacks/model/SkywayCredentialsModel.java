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
     * Peer ID
     */
    String peerId;

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
