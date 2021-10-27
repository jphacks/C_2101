package dev.abelab.jphacks.db.entity.join;

import lombok.*;
import dev.abelab.jphacks.db.entity.Participation;
import dev.abelab.jphacks.db.entity.User;

/**
 * 参加 + ユーザ
 */
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ParticipationWithUser extends Participation {

    /**
     * ユーザ
     */
    User user;

}
