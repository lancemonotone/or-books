#!/usr/bin/env bash
# Symlink discovery screenshots into audit/media for local preview.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE="${1:-$ROOT/../_office/screenshots}"
TARGET="$ROOT/media"

if [[ ! -d "$SOURCE" ]]; then
  echo "Source not found: $SOURCE" >&2
  echo "Usage: $0 [path-to-screenshots]" >&2
  exit 1
fi

mkdir -p "$TARGET"

for file in "$SOURCE"/*.{png,mp4}; do
  [[ -e "$file" ]] || continue
  base="$(basename "$file")"
  ln -sfn "$(cd "$(dirname "$file")" && pwd)/$base" "$TARGET/$base"
done

count=$(find "$TARGET" -maxdepth 1 \( -name '*.png' -o -name '*.mp4' \) 2>/dev/null | wc -l)
echo "Linked $count media files into audit/media"
