package dev.abelab.jphacks.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.apache.commons.net.util.Base64;
import org.modelmapper.ModelMapper;

import lombok.*;
import dev.abelab.jphacks.api.request.LoginRequest;
import dev.abelab.jphacks.api.request.SignupRequest;
import dev.abelab.jphacks.api.response.AccessTokenResponse;
import dev.abelab.jphacks.db.entity.User;
import dev.abelab.jphacks.model.FileModel;
import dev.abelab.jphacks.repository.UserRepository;
import dev.abelab.jphacks.logic.UserLogic;
import dev.abelab.jphacks.util.AuthUtil;
import dev.abelab.jphacks.util.CloudStorageUtil;
import dev.abelab.jphacks.exception.ErrorCode;
import dev.abelab.jphacks.exception.UnauthorizedException;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final ModelMapper modelMapper;

    private final UserLogic userLogic;

    private final UserRepository userRepository;

    private final CloudStorageUtil cloudStorageUtil;

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

        // アイコンをアップロード
        String iconUrl = null;
        if (requestBody.getIcon() != null) {
            final var file = FileModel.builder().content(Base64.decodeBase64(requestBody.getIcon())).build();
            file.setName(file.getName() + ".jpg");
            iconUrl = this.cloudStorageUtil.uploadFile(file);
        }

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

    /**
     * ログインユーザを取得
     *
     * @param credentials 資格情報
     *
     * @return ログインユーザ
     */
    @Transactional
    public User getLoginUser(final String credentials) {
        // 資格情報の構文チェック
        if (!credentials.startsWith("Bearer ")) {
            throw new UnauthorizedException(ErrorCode.INVALID_ACCESS_TOKEN);
        }
        final var jwt = credentials.substring(7);

        // ログインユーザを取得
        return this.userLogic.getLoginUser(jwt);
    }

}
