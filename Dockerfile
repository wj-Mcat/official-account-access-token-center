FROM node
LABEL maintainer="wj-Mcat (吴京京) <wjmcater@gmail.com>"

WORKDIR /app

COPY package.json .
RUN npm install -g typescript ts-node
RUN npm install

COPY . .

CMD ./bin/entrypoint.sh

#
# https://docs.docker.com/docker-cloud/builds/advanced/
# http://label-schema.org/rc1/
#

LABEL \
  org.label-schema.license="Apache-2.0" \
  org.label-schema.build-date="$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
  org.label-schema.version="$DOCKER_TAG" \
  org.label-schema.name="Wechaty Puppet Official Account AccessToken Center" \
  org.label-schema.description="Store and Refresh the AccessTOken" \
  org.label-schema.usage="https://github.com/wj-Mcat/official-account-access-token-center" \
  org.label-schema.url="https://github.com/wj-Mcat/official-account-access-token-center" \
  org.label-schema.vendor="wjMcat" \
  org.label-schema.vcs-url="https://github.com/wj-Mcat/official-account-access-token-center"