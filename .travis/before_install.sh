#!/bin/bash
set -e
# note: do not do set -x or the passwords will leak!

sudo apt-get -qq update
sudo apt-get install libgif-dev

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo "It is a pull request, not setting up release"
  exit 0
fi

if [[ $TRAVIS_BRANCH == 'master' || $TRAVIS_BRANCH == 'develop' ]]; then
  # install AWS CLI tools so we can upload pkg bundles to S3
  pip install --user awscli
  export PATH=$PATH:$HOME/.local/bin

  rm -rf .git
  git init
  git clean -dfx
  git remote add origin https://github.com/findify/findify-js.git
  git fetch origin
  git clone https://github.com/$TRAVIS_REPO_SLUG.git $TRAVIS_REPO_SLUG
  git checkout $TRAVIS_BRANCH

  git config credential.helper store
  echo "https://${RELEASE_GH_USERNAME}:${RELEASE_GH_TOKEN}@github.com/findify/findify-js.git" > ~/.git-credentials

  npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN -q
  npm prune

  git config --global user.email "yourfriends@findify.io"
  git config --global user.name "Findify"
  git config --global push.default simple

  git fetch --tags
  git branch -u origin/$TRAVIS_BRANCH
  git fsck --full #debug
  echo "npm whoami"
  npm whoami #debug
  echo "git config --list"
  git config --list #debug
fi
