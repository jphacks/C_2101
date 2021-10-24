
package dev.abelab.jphacks.service;

import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.modelmapper.ModelMapper;

import lombok.*;
import dev.abelab.jphacks.db.entity.User;
import dev.abelab.jphacks.api.request.LoginUserUpdateRequest;
import dev.abelab.jphacks.api.request.LoginUserPasswordUpdateRequest;
import dev.abelab.jphacks.api.response.UsersResponse;
import dev.abelab.jphacks.repository.UserRepository;
import dev.abelab.jphacks.logic.UserLogic;
import dev.abelab.jphacks.util.AuthUtil;
import dev.abelab.jphacks.api.response.UserResponse;

@RequiredArgsConstructor
@Service
public class UserService {

    private final ModelMapper modelMapper;

    private final UserRepository userRepository;

    private final UserLogic userLogic;

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

}
