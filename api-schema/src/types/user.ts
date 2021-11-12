import { UserResponse } from "../api/@types";

export type ClientUser = Omit<UserResponse, "email">;
