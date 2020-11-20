FROM ubuntu:14.04
LABEL maintainer="wj-Mcat (吴京京) <wjmcater@gmail.com>"

ENV DEBIAN_FRONTEND     noninteractive
ENV LC_ALL              C.UTF-8
ENV NPM_CONFIG_LOGLEVEL warn

# Installing the 'apt-utils' package gets rid of the 'debconf: delaying package configuration, since apt-utils is not installed'
# error message when installing any other package with the apt-get package manager.
# https://peteris.rocks/blog/quiet-and-unattended-installation-with-apt-get/
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    apt-utils \
    autoconf \
    automake \
    bash \
    build-essential \
    ca-certificates \
    curl \
    coreutils \
    ffmpeg \
    figlet \
    git \
    gnupg2 \
    jq \
    libgconf-2-4 \
    libtool \
    moreutils \
    python-dev \
    shellcheck \
    sudo \
    tzdata \
    vim \
    wget \
    libxtst6 \
  && apt-get purge --auto-remove \
  && rm -rf /tmp/* /var/lib/apt/lists/*

RUN curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash - \
    && apt-get update && apt-get install -y --no-install-recommends nodejs \
    && apt-get purge --auto-remove \
    && rm -rf /tmp/* /var/lib/apt/lists/*

# https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md
# https://github.com/ebidel/try-puppeteer/blob/master/backend/Dockerfile
# Install latest chrome dev package.
# Note: this also installs the necessary libs so we don't need the previous RUN command.
RUN  wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y --no-install-recommends \
    google-chrome-unstable \
  && apt-get purge --auto-remove \
  && rm -rf /tmp/* /var/lib/apt/lists/* \
  && rm -rf /usr/bin/google-chrome* /opt/google/chrome-unstable

WORKDIR /wechaty-puppet-access-token-center

COPY package.json .
RUN  npm install \
  && rm -fr /tmp/* ~/.npm

COPY . .

# Pre-install all puppets.
# Must be placed after `npm link`, or it will be all deleted by `npm link`
RUN  npm run puppet-install \
  && sudo rm -fr /tmp/* ~/.npm

# Loading from node_modules Folders: https://nodejs.org/api/modules.html
# If it is not found there, then it moves to the parent directory, and so on, until the root of the file system is reached.
RUN  mkdir /node_modules \
  && ln -sfv /usr/local/lib/node_modules/* /node_modules/ \
  && ln -sfv /usr/lib/node_modules/*       /node_modules/ \
  && ln -sfv /wechaty-puppet-access-token-center/node_modules/*       /node_modules/

ENTRYPOINT  [ "/bin/entrypoint.sh" ]
CMD        [ "" ]