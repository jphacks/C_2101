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

export type RoomAuthenticateRequest = {
  peerId: string
}

export type RoomCreateRequest = {
  description: string
  finishAt: string
  image?: string
  presentationTimeLimit: number
  questionTimeLimit: number
  startAt: string
  title?: string
}

export type RoomCredentialsResponse = {
  skyway: SkywayCredentialsModel
  type: number
}

export type RoomJoinRequest = {
  title?: string
  type: number
}

export type RoomResponse = {
  description: string
  finishAt: string
  id: number
  imageUrl: string
  owner: UserResponse
  presentationTimeLimit: number
  questionTimeLimit: number
  speakers: SpeakerResponse[]
  startAt: string
  title: string
  viewers: UserResponse[]
}

export type RoomsResponse = {
  rooms: RoomResponse[]
}

export type SignupRequest = {
  email: string
  icon?: string
  name: string
  password: string
}

export type SkywayCredentialsModel = {
  authToken: string
  peerId: string
  timestamp: number
  ttl: number
}

export type SpeakerResponse = {
  email: string
  iconUrl: string
  id: number
  name: string
  speakerOrder: number
  title: string
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
