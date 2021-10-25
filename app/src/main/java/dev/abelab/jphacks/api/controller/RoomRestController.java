package dev.abelab.jphacks.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;

import io.swagger.annotations.*;
import lombok.*;
import dev.abelab.jphacks.annotation.Authenticated;
import dev.abelab.jphacks.api.request.RoomCreateRequest;
import dev.abelab.jphacks.api.request.RoomJoinRequest;
import dev.abelab.jphacks.api.response.RoomsResponse;
import dev.abelab.jphacks.db.entity.User;
import dev.abelab.jphacks.service.RoomService;

@Api(tags = "Room")
@RestController
@RequestMapping(path = "/api/rooms", produces = MediaType.APPLICATION_JSON_VALUE)
@Validated
@RequiredArgsConstructor
@Authenticated
public class RoomRestController {

    private final RoomService roomService;

    /**
     * ルーム一覧取得API
     *
     * @param loginUser ログインユーザ
     *
     * @return ルーム一覧
     */
    @ApiOperation( //
        value = "ルーム一覧の取得", //
        notes = "ルーム一覧を取得する。" //
    )
    @ApiResponses( //
        value = { //
                @ApiResponse(code = 200, message = "取得成功", response = RoomsResponse.class), //
                @ApiResponse(code = 401, message = "ユーザがログインしていない"), //
        } //
    )
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public RoomsResponse getRooms( //
        @ModelAttribute("LoginUser") final User loginUser //
    ) {
        return this.roomService.getRooms(loginUser);
    }

    /**
     * ルーム作成API
     *
     * @param loginUser   ログインユーザ
     * @param requestBody ルーム作成リクエスト
     */
    @ApiOperation( //
        value = "ルームの作成", //
        notes = "ルームを作成する。" //
    )
    @ApiResponses( //
        value = { //
                @ApiResponse(code = 201, message = "作成成功"), //
                @ApiResponse(code = 400, message = "無効な開催日時"), //
                @ApiResponse(code = 401, message = "ユーザがログインしていない"), //
        } //
    )
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createRoom( //
        @ModelAttribute("LoginUser") final User loginUser, //
        @Validated @ApiParam(name = "body", required = true, value = "ルーム作成情報") @RequestBody final RoomCreateRequest requestBody //
    ) {
        this.roomService.createRoom(requestBody, loginUser);
    }

    /**
     * ルーム削除API
     *
     * @param loginUser ログインユーザ
     * @param roomId    ルームID
     */
    @ApiOperation( //
        value = "ルームの削除", //
        notes = "ルームを削除する。" //
    )
    @ApiResponses( //
        value = { //
                @ApiResponse(code = 200, message = "参加成功"), //
                @ApiResponse(code = 401, message = "ユーザがログインしていない"), //
                @ApiResponse(code = 403, message = "ユーザに権限がない"), //
                @ApiResponse(code = 404, message = "ルームが存在しない"), //
        } //
    )
    @DeleteMapping(value = "/{room_id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteRoom( //
        @ModelAttribute("LoginUser") final User loginUser, //
        @ApiParam(name = "room_id", required = true, value = "ルームID") @PathVariable("room_id") final int roomId //
    ) {
        this.roomService.deleteRoom(roomId, loginUser);
    }

    /**
     * ルーム参加登録API
     *
     * @param loginUser   ログインユーザ
     * @param roomId      ルームID
     * @param requestBody ルーム参加登録リクエスト
     */
    @ApiOperation( //
        value = "ルームの参加登録", //
        notes = "ルームを参加登録する。" //
    )
    @ApiResponses( //
        value = { //
                @ApiResponse(code = 200, message = "登録成功"), //
                @ApiResponse(code = 400, message = "参加登録できないルーム"), //
                @ApiResponse(code = 401, message = "ユーザがログインしていない"), //
                @ApiResponse(code = 409, message = "既に参加登録済み"), //
        } //
    )
    @PostMapping(value = "/{room_id}/join")
    @ResponseStatus(HttpStatus.OK)
    public void joinRoom( //
        @ModelAttribute("LoginUser") final User loginUser, //
        @ApiParam(name = "room_id", required = true, value = "ルームID") @PathVariable("room_id") final int roomId, //
        @Validated @ApiParam(name = "body", required = true, value = "参加登録情報") @RequestBody final RoomJoinRequest requestBody //
    ) {
    }

    /**
     * ルーム参加辞退API
     *
     * @param loginUser ログインユーザ
     * @param roomId    ルームID
     */
    @ApiOperation( //
        value = "ルームの参加辞退", //
        notes = "ルームを参加辞退する。" //
    )
    @ApiResponses( //
        value = { //
                @ApiResponse(code = 200, message = "辞退成功"), //
                @ApiResponse(code = 401, message = "ユーザがログインしていない"), //
                @ApiResponse(code = 404, message = "ルームが存在しない"), //
        } //
    )
    @PostMapping(value = "/{room_id}/unjoin")
    @ResponseStatus(HttpStatus.OK)
    public void unjoinRoom( //
        @ModelAttribute("LoginUser") final User loginUser, //
        @ApiParam(name = "room_id", required = true, value = "ルームID") @PathVariable("room_id") final int roomId //
    ) {
    }

}
