#! /bin/bash

emsdk_activate() {
    cd deps/emsdk
    ./emsdk install latest
    ./emsdk activate latest
    source ./emsdk_env.sh
    cd - > /dev/null
}
# cargo clean in core/rs/bundle

mkdir -p packages/crsqlite-wasm/dist
command -v emcc > /dev/null 2>&1 || emsdk_activate
cd deps/wa-sqlite
make
#cp dist/crsqlite.wasm ../../packages/crsqlite-wasm/dist/crsqlite.wasm
#cp dist/crsqlite.mjs ../../packages/crsqlite-wasm/src/crsqlite.mjs
