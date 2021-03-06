package dev.abelab.jphacks.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;

import io.swagger.annotations.*;
import lombok.*;
import dev.abelab.jphacks.api.request.LoginRequest;
import dev.abelab.jphacks.api.request.SignupRequest;
import dev.abelab.jphacks.api.response.AccessTokenResponse;
import dev.abelab.jphacks.service.AuthService;

@Api(tags = "Auth")
@RestController
@RequestMapping(path = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
@Validated
@RequiredArgsConstructor
public class AuthRestController {

    private final AuthService authService;

    /**
     * ログイン処理API
     *
     * @param requestBody ログイン情報
     *
     * @return アクセストークンレスポンス
     */
    @ApiOperation(value = "ログイン", //
        notes = "ユーザのログイン処理を行う。" //
    )
    @ApiResponses(value = { //
            @ApiResponse(code = 200, message = "ログイン成功", response = AccessTokenResponse.class), //
            @ApiResponse(code = 401, message = "パスワードが間違っている"), //
            @ApiResponse(code = 404, message = "ユーザが存在しない"), //
    })
    @PostMapping(value = "/login")
    @ResponseStatus(HttpStatus.OK)
    public AccessTokenResponse login( //
        @Validated @ApiParam(name = "body", required = true, value = "ログイン情報") @RequestBody final LoginRequest requestBody //
    ) {
        return this.authService.login(requestBody);
    }

    /**
     * サインアップ処理API
     *
     * @param requestBody サインアップリクエスト
     *
     * @return アクセストークンレスポンス
     */
    @ApiOperation( //
        value = "サインアップ", //
        notes = "ユーザのサインアップ処理を行う。" //
    )
    @ApiResponses( //
        value = { //
                @ApiResponse(code = 201, message = "作成成功", response = AccessTokenResponse.class), //
                @ApiResponse(code = 400, message = "無効なパスワード"), //
                @ApiResponse(code = 401, message = "ユーザがログインしていない"), //
                @ApiResponse(code = 403, message = "ユーザに権限がない"), //
                @ApiResponse(code = 409, message = "ユーザが既に存在している"), //
        } //
    )
    @PostMapping(value = "/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public AccessTokenResponse signup( //
        @Validated @ApiParam(name = "body", required = true, value = "サインアップ情報") @RequestBody final SignupRequest requestBody //
    ) {
        return this.authService.signup(requestBody);
    }

}
