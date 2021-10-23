package dev.abelab.jphacks.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.*;
import dev.abelab.jphacks.api.request.LoginRequest;
import dev.abelab.jphacks.api.response.AccessTokenResponse;
import dev.abelab.jphacks.repository.UserRepository;
import dev.abelab.jphacks.logic.UserLogic;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserLogic userLogic;

    private final UserRepository userRepository;

    /**
     * ログイン処理
     *
     * @param requestBody ログインリクエスト
     *
     * @return アクセストークンレスポンス
     */
    @Transactional
    public AccessTokenResponse login(final LoginRequest requestBody) {
        // ログインユーザを取得
        final var loginUser = this.userRepository.selectByEmail(requestBody.getEmail());

        // パスワードチェック
        this.userLogic.verifyPassword(loginUser, requestBody.getPassword());

        // JWTを発行
        final var jwt = this.userLogic.generateJwt(loginUser);
        return AccessTokenResponse.builder() //
            .accessToken(jwt) //
            .tokenType("Bearer") //
            .build();
    }

}
