package dev.abelab.jphacks.api.response;

import java.util.List;

import lombok.*;

/**
 * ユーザ一覧レスポンス
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsersResponse {

    /**
     * ユーザ一覧
     */
    List<UserResponse> users;

}
