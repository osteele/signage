# Source this in bash or zsh to get some aliases for
# developing this app in a docker container

d.exec () {
  docker run \
    -v yarn_cache:/root/.cache/yarn \
    -v `pwd`:/app \
    -v signage_node_modules:/app/node_modules \
    -p 3000:3000 \
    -it \
    node \
    "$@"
}

d.bash () {
  d.exec bash -c 'cd /app && bash --login'
}

d.yarn () {
  d.exec bash -c "cd /app && yarn $@"
}

d.run () {
  d.yarn start
}
