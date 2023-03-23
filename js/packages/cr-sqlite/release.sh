#!/bin/sh

set -e

VERSION=$1

[ ! -n "$VERSION" ] && echo "Enter release version: " && read VERSION

echo "Releasing $VERSION - are you sure? (y/n):" && read CONFIRM && [ "$CONFIRM" != "y" ] && exit 0

TAG_PREFIX='@dyu/cr-sqlite'
MSG="[$TAG_PREFIX release] $VERSION"

# manual git tagging
npm --no-git-tag-version version $VERSION
git add -u .
git commit -m "$MSG"
git tag "$TAG_PREFIX@$VERSION" -am "$MSG"

# publish
git push origin "refs/tags/$TAG_PREFIX@$VERSION"
git push -u origin master
pnpm publish --access public

echo "Released $VERSION"
