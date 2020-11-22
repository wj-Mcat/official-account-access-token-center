FROM node
LABEL maintainer="wj-Mcat (吴京京) <wjmcater@gmail.com>"

WORKDIR /wechaty-puppet-access-token-center

COPY package.json .
# RUN  npm install

COPY . .

ENTRYPOINT  [ "/wechaty-puppet-access-token-center/bin/entrypoint.sh" ]
CMD [ "" ]