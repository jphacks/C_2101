package dev.abelab.jphacks.service;

import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.apache.commons.net.util.Base64;
import org.modelmapper.ModelMapper;

import lombok.*;
import dev.abelab.jphacks.api.request.LoginUserUpdateRequest;
import dev.abelab.jphacks.api.request.LoginUserPasswordUpdateRequest;
import dev.abelab.jphacks.api.response.UsersResponse;
import dev.abelab.jphacks.api.response.UserResponse;
import dev.abelab.jphacks.db.entity.User;
import dev.abelab.jphacks.model.FileModel;
import dev.abelab.jphacks.repository.UserRepository;
import dev.abelab.jphacks.logic.UserLogic;
import dev.abelab.jphacks.util.AuthUtil;
import dev.abelab.jphacks.util.CloudStorageUtil;
import dev.abelab.jphacks.exception.ErrorCode;
import dev.abelab.jphacks.exception.ConflictException;

@RequiredArgsConstructor
@Service
public class UserService {

    private final ModelMapper modelMapper;

    private final UserRepository userRepository;

    private final UserLogic userLogic;

    private final CloudStorageUtil cloudStorageUtil;

    /**
     * プロフィールを取得
     *
     * @param loginUser ログインユーザ
     *
     * @return ユーザ詳細レスポンス
     */
    @Transactional
    public UserResponse getLoginUser(final User loginUser) {
        return this.modelMapper.map(loginUser, UserResponse.class);
    }

    /**
     * ユーザ一覧を取得
     *
     * @param loginUser ログインユーザ
     *
     * @return ユーザ一覧レスポンス
     */
    @Transactional
    public UsersResponse getUsers(final User loginUser) {
        // ユーザ一覧の取得
        final var users = this.userRepository.findAll();
        final var userResponses = users.stream() //
            .map(user -> this.modelMapper.map(user, UserResponse.class)) //
            .collect(Collectors.toList());

        return new UsersResponse(userResponses);
    }

    /**
     * ログインユーザを更新
     *
     * @param requestBody ログインユーザ更新リクエスト
     * @param loginUser   ログインユーザ
     */
    @Transactional
    public void updateLoginUser(final LoginUserUpdateRequest requestBody, final User loginUser) {
        // メールアドレスが既に存在するかチェック
        if (this.userRepository.existsByEmail(requestBody.getEmail())) {
            throw new ConflictException(ErrorCode.CONFLICT_EMAIL);
        }

        // アイコンをアップロード
        String iconUrl = null;
        if (requestBody.getIcon() != null) {
            final var file = FileModel.builder().content(Base64.decodeBase64(requestBody.getIcon())).build();
            file.setName("icons/" + file.getName());
            iconUrl = this.cloudStorageUtil.uploadFile(file);
        }

        // ログインユーザを更新
        loginUser.setEmail(requestBody.getEmail());
        loginUser.setName(requestBody.getName());
        loginUser.setIconUrl(iconUrl);

        this.userRepository.update(loginUser);
    }

    /**
     * ログインユーザを削除
     *
     * @param loginUser ログインユーザ
     */
    @Transactional
    public void deleteLoginUser(final User loginUser) {
        // ログインユーザを削除
        this.userRepository.deleteById(loginUser.getId());
    }

    /**
     * ログインユーザのパスワードを更新
     *
     * @param requestBody ログインユーザパスワード更新リクエスト
     * @param loginUser   ログインユーザ
     */
    @Transactional
    public void updateLoginPasswordUser(final LoginUserPasswordUpdateRequest requestBody, final User loginUser) {
        // 現在のパスワードチェック
        this.userLogic.verifyPassword(loginUser, requestBody.getCurrentPassword());

        // 有効なパスワードかチェック
        AuthUtil.validatePassword(requestBody.getNewPassword());

        // ログインユーザのパスワードを更新
        loginUser.setPassword(this.userLogic.encodePassword(requestBody.getNewPassword()));
        this.userRepository.update(loginUser);
    }

}
