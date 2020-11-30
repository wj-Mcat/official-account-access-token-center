# official-account-access-token-center

> store and refresh the access token in a lazy mode

this is the simple service for one thing: Store and Refresh the token when you need, which has the same expire-time with tencent server. So you can easily use it with [wechaty-puppet-official-account](https://github.com/wechaty/wechaty-puppet-official-account). 

## Usage

- pull the docker image

```shell
docker pull mcatwj/wechaty-puppet-official-account-at:latest
```

- run & expose service

```shell
docker run -p your-port:8080 mcatwj/wechaty-puppet-official-account-at:latest
```

- configure endpoint to puppet-official-account [Optional]

> this is only for someone who use wechaty, refer to : [wechaty-puppet-official-account pr#8](https://github.com/wechaty/wechaty-puppet-official-account/pull/18)

```shell
export WECHATY_PUPPET_OA_ACCESS_TOKEN_PROXY=http://your-endpoint/
```

enjoy yourself with `access-token-center` service.

## HISTORY

### v0.0.4 master

1. Enable the expire-time of the access-token same with Tencent server

### v0.0.1 (Nov 20, 2020)

Initial version for AccesToken Center.

1. store & refresh access token with LRU mechanism
2. deploy it as a docker

## AUTHOR

[吴京京](http://github.com/wj-Mcat) \<wjmcater@gmail.com\>

## COPYRIGHT & LICENSE

- Code & Docs © 2020 吴京京 \<wjmcater@gmail.com\>
- Code released under the Apache-2.0 License
- Docs released under Creative Commons