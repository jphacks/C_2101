package dev.abelab.jphacks.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.modelmapper.ModelMapper;

import lombok.*;
import dev.abelab.jphacks.api.request.LoginRequest;
import dev.abelab.jphacks.api.request.SignupRequest;
import dev.abelab.jphacks.api.response.AccessTokenResponse;
import dev.abelab.jphacks.db.entity.User;
import dev.abelab.jphacks.repository.UserRepository;
import dev.abelab.jphacks.logic.UserLogic;
import dev.abelab.jphacks.util.AuthUtil;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final ModelMapper modelMapper;

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

    /**
     * サインアップ処理
     *
     * @param requestBody サインアップリクエスト
     *
     * @return アクセストークンレスポンス
     */
    @Transactional
    public AccessTokenResponse signup(final SignupRequest requestBody) {
        // 有効なパスワードかチェック
        AuthUtil.validatePassword(requestBody.getPassword());

        // TODO: アイコンをアップロード
        final var iconUrl = "http://example.com";

        // ユーザを作成
        final var user = this.modelMapper.map(requestBody, User.class);
        user.setPassword(this.userLogic.encodePassword(requestBody.getPassword()));
        user.setIconUrl(iconUrl);
        this.userRepository.insert(user);

        // JWTを発行
        final var jwt = this.userLogic.generateJwt(user);
        return AccessTokenResponse.builder() //
            .accessToken(jwt) //
            .tokenType("Bearer") //
            .build();
    }

}
