#!/usr/bin/zsh

# abort on errors
set -e

# remove old dist
rm -rf src/dist

# build
npm run build

# copy 404.png into the build output directory
cp src/assets/404.png src/dist/assets/

# navigate into the build output directory
cd src/dist

# if you are deploying to a custom domain
cp index.html 404.html

git init

git add .

git commit -m "deploy"

git remote add origin git@github.com:kaangiray26/deezer-plus.git

git push --force origin master:gh-pages

cd ../..