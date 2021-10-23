package dev.abelab.jphacks.api.request;

import java.util.Date;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.*;

/**
 * ルーム作成リクエスト
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomCreateRequest {

    /**
     * タイトル
     */
    @Size(max = 255)
    String title;

    /**
     * 説明文
     */
    @NotBlank
    @Size(max = 1000)
    String description;

    /**
     * 開始日時
     */
    @NotNull
    Date startAt;

    /**
     * 終了日時
     */
    @NotNull
    Date finishAt;

}
