package dev.abelab.jphacks.db.mapper;

import java.util.List;

import dev.abelab.jphacks.db.entity.join.ParticipationWithUser;
import dev.abelab.jphacks.db.mapper.base.ParticipationBaseMapper;

public interface ParticipationMapper extends ParticipationBaseMapper {

    List<ParticipationWithUser> selectWithUserByRoomId(final int roomId);

}
