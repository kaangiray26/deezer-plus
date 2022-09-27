#!/usr/bin/zsh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd src/dist

# if you are deploying to a custom domain
echo 'deezer.buzl.uk' > CNAME

git add -A
git commit -m 'deploy'
git checkout gh-pages
git push origin gh-pages

cd -