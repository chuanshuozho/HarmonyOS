#!/usr/bin/env bash
set -eu
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DIR="$ROOT/tools/node-regression"
mkdir -p "$DIR/work/models" "$DIR/work/engine" "$DIR/dist"
cp "$ROOT/entry/src/main/ets/models/Models.ets" "$DIR/work/models/Models.ts"
cp "$ROOT/entry/src/main/ets/engine/RuleEngine.ets" "$DIR/work/engine/RuleEngine.ts"
tsc --target ES2021 --module commonjs --strict --skipLibCheck --outDir "$DIR/dist" "$DIR/work/models/Models.ts" "$DIR/work/engine/RuleEngine.ts"
node "$DIR/run.cjs"
