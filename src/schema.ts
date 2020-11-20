export interface AccessTokenPayload {
  errcode?    : number,
  errmsg?     : string,
  access_token: string,
  expires_in  : number,
}

export interface AccessTokenPayloadResponse {
  data  : AccessTokenPayload,
  status: number,
}

export type StoreTypes = 'lru' | 'flash-store'
