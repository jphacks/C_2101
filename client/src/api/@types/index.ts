/* eslint-disable */
export type AccessTokenResponse = {
  accessToken: string
  tokenType: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginUserPasswordUpdateRequest = {
  currentPassword: string
  newPassword: string
}

export type LoginUserUpdateRequest = {
  email: string
  icon?: string
  name: string
}

export type RoomCreateRequest = {
  description: string
  finishAt: string
  startAt: string
  title?: string
}

export type RoomJoinRequest = {
  title: string
  type: number
}

export type RoomResponse = {
  description: string
  finishAt: string
  id: number
  owner: UserResponse
  speakers: UserResponse[]
  startAt: string
  title: string
  viewers: UserResponse[]
}

export type RoomsResponse = {
  rooms: RoomResponse[]
}

export type SignupRequest = {
  email: string
  icon: string
  name: string
  password: string
}

export type UserResponse = {
  email: string
  iconUrl: string
  id: number
  name: string
}

export type UsersResponse = {
  users: UserResponse[]
}
