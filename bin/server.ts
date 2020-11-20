import { 
  AccessTokenServer,
  AccessTokenServerOptions

}  from '../src/mod'
import {
  log
} from 'wechaty-puppet'

async function startServer() {
  log.verbose('starting the access token server ...')
  const options: AccessTokenServerOptions = {
    port: 8080,
    store: 'lru',
  }
  const server = new AccessTokenServer(options)
  await server.start()
}

startServer().catch(console.error)