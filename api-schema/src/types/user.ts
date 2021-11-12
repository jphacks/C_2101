import { UserResponse } from "../api/@types";

export type UserInfo = Omit<UserResponse, "email">;
