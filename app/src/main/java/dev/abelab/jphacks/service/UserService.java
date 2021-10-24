
package dev.abelab.jphacks.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.modelmapper.ModelMapper;

import lombok.*;
import dev.abelab.jphacks.db.entity.User;
import dev.abelab.jphacks.api.request.LoginUserUpdateRequest;
import dev.abelab.jphacks.api.request.LoginUserPasswordUpdateRequest;
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

}
