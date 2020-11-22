/* eslint-disable camelcase */
import http         from 'http'
import express      from 'express'
import axios        from 'axios'

import { log } from 'wechaty-puppet'

import { 
  StoreTypes,
  AccessTokenPayloadResponse,
  AccessTokenPayload
} from './schema'
import {
  AccessTokenStore,
  LRUAccessTokenStore
}                             from './access-token-store'

export interface AccessTokenServerOptions {
  expireTime?: number,
  store      : StoreTypes,
  port       : number
}

export class AccessTokenServer  {

  protected server?          : http.Server
  protected expireTime?      : number
  protected accessTokenStore?: AccessTokenStore
  protected port?            : number

  public constructor(options: AccessTokenServerOptions) {
    log.verbose('AccessTokenServer', 'constructor(%s)', JSON.stringify(options))

    if (!options.expireTime) {
      this.expireTime = 7200
    } else {
      this.expireTime = options.expireTime
    }

    if (options.store == 'lru') {
      this.accessTokenStore = new LRUAccessTokenStore()
    }
    else {
      throw new Error(`store types(${options.store}) not supported`)
    }

    if (!options.port) {
      throw new Error('port option is required')
    }
    this.port = options.port

  }

  async appGet (
    req : express.Request,
    res : express.Response,
  ): Promise<void> {
    log.verbose('Webhook', 'appGet({url: %s})', req.url)

    const {
      appid, secret
    }             = req.query as { [key: string]: string }

    if (!appid) {
      const errorPayload: AccessTokenPayload = {
        errmsg      : 'appid & secret are required',
        errcode     : 40013,
        access_token: '',
        expires_in  : 0
      }
      res.send(errorPayload)
      return
    }

    if (!this.accessTokenStore) {
      throw new Error(`accessTokenStore is not initialized before get accessToken`)
    }

    /**
     * 1. get payload from the cache
     */
    const key = `${appid}-${secret}`
    const payload = await this.accessTokenStore.get(key)
    if (payload) {
      res.send(payload)
      return
    }

    /**
     * 2. get access token from tencent server and cache it
     */
    const accessTokenResponse: AccessTokenPayloadResponse = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`)
    await this.accessTokenStore.set(key, accessTokenResponse.data)

    res.send(accessTokenResponse.data)
  }

  async start () {
    log.verbose('Webhook', 'start()')

    if (!this.accessTokenStore) {
      throw new Error('accesTokenStore is not initialized before start()')
    }

    await this.accessTokenStore.start()

    const app = express()

    app.get('/',  this.appGet.bind(this))
    app.get('/token', this.appGet.bind(this))

    const server = this.server = http.createServer(app)

    await new Promise((resolve, _) => {
      /**
       * 1. for local port
       */
      log.verbose('AccessTokenServer', `started at 0.0.0.0:${this.port}`)
      server.listen(this.port, resolve)
    })
  }

  async stop () {
    log.verbose('Webhook', 'stop()')

    if (this.server) {
      this.server.close()
      this.server = undefined
    }
  }
}