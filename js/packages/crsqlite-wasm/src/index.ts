import SQLiteAsyncESMFactory from "@vlcn.io/wa-sqlite/dist/wa-sqlite-async.mjs";
// @ts-ignore
import wasmUrl from "@vlcn.io/wa-sqlite/dist/wa-sqlite-async.wasm?url";
import * as SQLite from "@vlcn.io/wa-sqlite";
// @ts-ignore
import { IDBBatchAtomicVFS } from "@vlcn.io/wa-sqlite/src/examples/IDBBatchAtomicVFS.js";
// @ts-ignore
import { OriginPrivateFileSystemVFS } from "@vlcn.io/wa-sqlite/src/examples/OriginPrivateFileSystemVFS.js";

import { serialize, topLevelMutex } from "./serialize.js";
import { DB } from "./DB.js";
export { DB } from "./DB.js";

const FILE_URI_PREFIX = "file:///";

let api: SQLite3 | null = null;
type SQLiteAPI = ReturnType<typeof SQLite.Factory>;

export class SQLite3 {
  constructor(private base: SQLiteAPI) {}

  open(filename: string, mode: string = "c") {
    const opfs = filename.startsWith(FILE_URI_PREFIX);
    const name = opfs ? filename.substring(FILE_URI_PREFIX.length) : filename;
    return serialize(
      null,
      undefined,
      () => {
        return this.base.open_v2(
          filename,
          SQLite.SQLITE_OPEN_CREATE |
            SQLite.SQLITE_OPEN_READWRITE |
            SQLite.SQLITE_OPEN_URI,
          opfs ? "opfs" : "idb-batch-atomic"
        );
      },
      topLevelMutex
    ).then((db: any) => {
      const ret = new DB(this.base, db, name);
      return ret.execA("select quote(crsql_siteid());").then((siteid) => {
        ret._setSiteid(siteid[0][0].replace(/'|X/g, ""));
        return ret;
      });
    });
  }
}

export default async function initWasm(
  locateWasm?: (file: string) => string
): Promise<SQLite3> {
  if (api != null) {
    return api;
  }

  const wasmModule = await SQLiteAsyncESMFactory({
    locateFile(file: string) {
      return locateWasm ? locateWasm(file) : wasmUrl;
    },
  });
  const sqlite3 = SQLite.Factory(wasmModule);
  sqlite3.vfs_register(
    new OriginPrivateFileSystemVFS(),
    true,
  );
  sqlite3.vfs_register(
    new IDBBatchAtomicVFS("idb-batch-atomic", { durability: "relaxed" })
  );
  api = new SQLite3(sqlite3);
  return api;
}
