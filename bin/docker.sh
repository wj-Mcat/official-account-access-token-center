#!/bin/bash -x

IMAGE_NAME=wechaty-puppet-official-account-at
function deploy () {
  version="$(cat VERSION)"
  docker push "mcatwj/${IMAGE_NAME}:${version}"
  docker push "mcatwj/${IMAGE_NAME}:latest"
}

function build () {
  version="$(cat VERSION)"
  docker build -t "mcatwj/${IMAGE_NAME}:${version}" .
  docker build -t "mcatwj/${IMAGE_NAME}:latest" .
}

function main () {
  case "$1" in
    build | '')
      build
      ;;
    deploy)
      deploy deploy
      ;;
  esac
}

main "$@"