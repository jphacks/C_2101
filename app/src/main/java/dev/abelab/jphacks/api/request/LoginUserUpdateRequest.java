package dev.abelab.jphacks.api.request;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.*;

/**
 * ログインユーザ更新リクエスト
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginUserUpdateRequest {

    /**
     * メールアドレス
     */
    @NotNull
    @Size(max = 255)
    String email;

    /**
     * ユーザ名
     */
    @NotNull
    @Size(max = 100)
    String name;

    /**
     * ユーザアイコン(Base64)
     */
    String icon;

}
