import React from "react";
import { useMembersValue } from "../../../../lib/hooks/useSyncMembers";
import { MemberBlock } from "./MemberBlock";

export const MemberBlockContainer: React.VFC = () => {
  const members = useMembersValue();

  return <MemberBlock members={members} />;
};
