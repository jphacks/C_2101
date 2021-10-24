package dev.abelab.jphacks.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;

import io.swagger.annotations.*;
import lombok.*;
import dev.abelab.jphacks.annotation.Authenticated;
import dev.abelab.jphacks.api.request.LoginUserUpdateRequest;
import dev.abelab.jphacks.api.request.LoginUserPasswordUpdateRequest;
import dev.abelab.jphacks.api.response.UsersResponse;
import dev.abelab.jphacks.api.response.UserResponse;
import dev.abelab.jphacks.db.entity.User;
import dev.abelab.jphacks.service.UserService;

@Api(tags = "User")
@RestController
@RequestMapping(path = "/api/users", produces = MediaType.APPLICATION_JSON_VALUE)
@Validated
@RequiredArgsConstructor
@Authenticated
public class UserRestController {

    private final UserService userService;

    /**
     * ユーザ一覧取得API
     *
     * @param loginUser ログインユーザ
     *
     * @return ユーザ一覧
     */
    @ApiOperation( //
        value = "ユーザ一覧の取得", //
        notes = "ユーザ一覧を取得する。" //
    )
    @ApiResponses( //
        value = { //
                @ApiResponse(code = 200, message = "取得成功", response = UsersResponse.class), //
                @ApiResponse(code = 401, message = "ユーザがログインしていない"), //
        } //
    )
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public UsersResponse getUsers( //
        @ModelAttribute("LoginUser") final User loginUser //
    ) {
        return this.userService.getUsers(loginUser);
    }

    /**
     * ログインユーザのパスワード更新API
     *
     * @param requestBody ログインユーザのパスワード更新リクエスト
     * @param loginUser   ログインユーザ
     */
    @ApiOperation( //
        value = "ログインユーザのパスワード更新", //
        notes = "ログインユーザのパスワードを更新する。" //
    )
    @ApiResponses( //
        value = { //
                @ApiResponse(code = 200, message = "更新成功"), //
                @ApiResponse(code = 400, message = "無効なパスワード"), //
                @ApiResponse(code = 401, message = "ユーザがログインしていない"), //
        } //
    )
    @PutMapping(value = "/me/password")
    @ResponseStatus(HttpStatus.OK)
    public void updateLoginUserPassword( //
        @ModelAttribute("LoginUser") final User loginUser, //
        @Validated @ApiParam(name = "body", required = true, value = "パスワード更新情報")
        @RequestBody final LoginUserPasswordUpdateRequest requestBody //
    ) {
        this.userService.updateLoginPasswordUser(requestBody, loginUser);
    }

    /**
     * プロフィール取得API
     *
     * @param loginUser ログインユーザ
     *
     * @return ユーザ詳細レスポンス
     */
    @ApiOperation( //
        value = "プロフィール取得", //
        notes = "プロフィールを取得する。" //
    )
    @ApiResponses( //
        value = { //
                @ApiResponse(code = 200, message = "取得成功", response = UserResponse.class), //
                @ApiResponse(code = 401, message = "ユーザがログインしていない"), //
                @ApiResponse(code = 404, message = "ユーザが存在しない") //
        })
    @GetMapping(value = "/me")
    @ResponseStatus(HttpStatus.OK)
    public UserResponse getLoginUser( //
        @ModelAttribute("LoginUser") final User loginUser //
    ) {
        return this.userService.getLoginUser(loginUser);
    }

    /**
     * ログインユーザ更新API
     *
     * @param loginUser   ログインユーザ
     *
     * @param requestBody ログインユーザ更新リクエスト
     */
    @ApiOperation( //
        value = "ログインユーザの更新", //
        notes = "ログインユーザを更新する。" //
    )
    @ApiResponses( //
        value = { //
                @ApiResponse(code = 200, message = "更新成功"), //
                @ApiResponse(code = 401, message = "ユーザがログインしていない"), //
        } //
    )
    @PutMapping(value = "/me")
    @ResponseStatus(HttpStatus.OK)
    public void updateLoginUser( //
        @ModelAttribute("LoginUser") final User loginUser, //
        @Validated @ApiParam(name = "body", required = true, value = "ユーザ更新情報") @RequestBody final LoginUserUpdateRequest requestBody //
    ) {
        this.userService.updateLoginUser(requestBody, loginUser);
    }

    /**
     * ログインユーザ削除API
     *
     * @param loginUser ログインユーザ
     */
    @ApiOperation( //
        value = "ログインユーザの削除", //
        notes = "ログインユーザを削除する。" //
    )
    @ApiResponses( //
        value = { //
                @ApiResponse(code = 200, message = "削除成功"), //
                @ApiResponse(code = 401, message = "ユーザがログインしていない"), //
                @ApiResponse(code = 404, message = "ユーザが存在しない"), //
        } //
    )
    @DeleteMapping(value = "/me")
    @ResponseStatus(HttpStatus.OK)
    public void deleteUser( //
        @ModelAttribute("LoginUser") final User loginUser //
    ) {
        this.userService.deleteLoginUser(loginUser);
    }

}
