import { log } from 'wechaty-puppet'

import LRU            from 'lru-cache'

import {
  AccessTokenPayload
}                         from './schema'

abstract class AccessTokenStore {
  async start() {}
  async stop() {}
  
  public abstract async get (key: string): Promise<AccessTokenPayload | null>

  public abstract async set(key: string, value: AccessTokenPayload): Promise<void>
}


class LRUAccessTokenStore extends AccessTokenStore {
  
  protected cacheAccessTokenPayload? : LRU<string, AccessTokenPayload>

  constructor () {
    super()
    log.verbose('AccessTokenStore', 'constructor()')
  }

  async start () {
    log.verbose('AccessTokenStore', 'start()')

    if (this.cacheAccessTokenPayload) {
      throw new Error('AccessTokenStore should be stop() before start() again.')
    }

    /**
     * LRU
     */
    const lruOptions: LRU.Options<string, AccessTokenPayload> = {
      dispose (key: string, val: any) {
        log.silly('AccessTokenStore', `constructor() lruOptions.dispose(${key}, ${JSON.stringify(val)})`)
      },
      max    : 1000,
      maxAge : 1000 * 60 * 60,
    }

    this.cacheAccessTokenPayload = new LRU<string, AccessTokenPayload>(lruOptions)
  }

  async stop () {
    log.verbose('PayloadStore', 'stop()')

    if (this.cacheAccessTokenPayload) {
      this.cacheAccessTokenPayload = undefined
    }
  }

  public async get(key: string): Promise<AccessTokenPayload | null> {
    log.info('LRUAccessTokenStore', 'get(%s)', key)
    
    if (!this.cacheAccessTokenPayload) {
      throw new Error(`cache payload not found`)
    }

    const payload = this.cacheAccessTokenPayload.get(key)
    if (payload) {
      return payload
    }
    return null
  }

  public async set(key: string, value: AccessTokenPayload): Promise<void> {
    log.info('LRUAccessTokenStore', 'set(%s, %s)', JSON.stringify({key, value}))
    
    if (!this.cacheAccessTokenPayload) {
      throw new Error(`cache payload not found`)
    }
    this.cacheAccessTokenPayload.set(key, value)
  }

}

export { AccessTokenStore, LRUAccessTokenStore }
