#!/usr/bin/zsh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd src/dist

# if you are deploying to a custom domain
echo 'deezer.buzl.uk' > CNAME

git init

git add .

git commit -m "deploy"

git remote add origin git@github.com:kaangiray26/deezer-plus.git

git push --force origin master:gh-pages

cd ../..