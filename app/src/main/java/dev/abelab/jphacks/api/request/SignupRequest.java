package dev.abelab.jphacks.api.request;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.*;

/**
 * サインアップリクエスト
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequest {

    /**
     * メールアドレス
     */
    @NotNull
    @Size(max = 255)
    String email;

    /**
     * パスワード
     */
    @NotNull
    @Size(max = 255)
    String password;

    /**
     * ユーザ名
     */
    @NotNull
    @Size(max = 100)
    String name;

    /**
     * ユーザアイコン(Base64)
     */
    @NotNull
    String icon;

}
