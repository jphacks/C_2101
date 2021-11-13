export type SocketMemberMap = Record<string, MemberItem>;

export type MemberItem =
  | {
      type: "guest";
    }
  | {
      type: "user";
      userId: string
    };
