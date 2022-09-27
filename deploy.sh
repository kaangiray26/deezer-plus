#!/usr/bin/zsh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd src

# if you are deploying to a custom domain
echo 'deezer.buzl.uk' > dist/CNAME

cp -r dist ~/
git checkout gh-pages
cp -r ~/dist/. ./