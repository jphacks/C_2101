package dev.abelab.jphacks.api.request;

import javax.validation.constraints.NotNull;

import lombok.*;

/**
 * ルーム認証リクエスト
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomAuthenticateRequest {

    /**
     * Peer ID
     */
    @NotNull
    String peerId;

}
