#!/usr/bin/env bash
#
# Builds the Wave Crest landing page (github.com/DRP-dulshan/jebel-ali) as a
# static export under /properties/jebel-ali-villa and copies it into
# public/properties/jebel-ali-villa, where this site serves it.
#
# The landing page is edited in its own repo. After a change there, run:
#
#   scripts/build-jebel-ali-villa.sh            # clones the repo's main branch
#   scripts/build-jebel-ali-villa.sh ../jebel-ali   # or builds a local checkout
#
# then commit public/properties/jebel-ali-villa.
set -euo pipefail

BASE_PATH=/properties/jebel-ali-villa
SITE_URL=https://dubairapidproperties.com$BASE_PATH
ROOT=$(cd "$(dirname "$0")/.." && pwd)
OUT=$ROOT/public$BASE_PATH

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

if [ $# -ge 1 ]; then
  cp -R "$1"/. "$WORK"/
  rm -rf "$WORK/.next" "$WORK/out"
else
  git clone --quiet --depth 1 https://github.com/DRP-dulshan/jebel-ali "$WORK"
fi

cd "$WORK"
# The canonical URL, Open Graph image and JSON-LD point at the page's new address
sed -i.bak -E "s#^(\s*url: )\"[^\"]*\",#\1\"$SITE_URL\",#" content/site.ts
grep -q "url: \"$SITE_URL\"" content/site.ts || { echo "Could not set site.url in content/site.ts" >&2; exit 1; }
# This site serves the page without a trailing slash, so neither the export
# nor its canonical link may use one
sed -i.bak 's#trailingSlash: true#trailingSlash: false#' next.config.mjs
grep -q 'trailingSlash: false' next.config.mjs || { echo "Could not set trailingSlash in next.config.mjs" >&2; exit 1; }
sed -i.bak 's#const pageUrl = `${site.url}/`;#const pageUrl = site.url;#' app/layout.tsx
grep -q 'const pageUrl = site.url;' app/layout.tsx || { echo "Could not set pageUrl in app/layout.tsx" >&2; exit 1; }

[ -d node_modules ] || npm ci --no-audit --no-fund
NEXT_PUBLIC_BASE_PATH=$BASE_PATH npx next build

rm -rf "$OUT"
mkdir -p "$(dirname "$OUT")"
cp -R out "$OUT"
# This site has its own 404 page
rm -rf "$OUT/404" "$OUT/404.html" "$OUT"/_not-found*
echo "Landing page written to public$BASE_PATH"
