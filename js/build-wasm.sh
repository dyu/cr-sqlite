#! /bin/bash

emsdk_activate() {
    cd deps/emsdk
    ./emsdk install latest
    ./emsdk activate latest
    source ./emsdk_env.sh
    cd - > /dev/null
}

mkdir -p packages/crsqlite-wasm/dist
command -v emcc > /dev/null 2>&1 || emsdk_activate
cd deps/wa-sqlite
make
#cp dist/wa-sqlite-async.wasm ../../packages/crsqlite-wasm/dist/crsqlite.wasm
#cp dist/wa-sqlite-async.mjs ../../packages/crsqlite-wasm/src/crsqlite.mjs
