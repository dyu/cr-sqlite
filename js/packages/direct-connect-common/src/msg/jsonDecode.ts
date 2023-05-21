// decode json strings to correct types.
// do appropriate validations on:
// - db names
// - schema names
// - bigint conversions

import { Change, Msg, Tag, tags } from "../types.js";
import { hexToBytes } from "../util.js";

export default function decode(parsed: { [key: string]: any }): Msg {
  switch (parsed._tag as Tag[keyof Tag]) {
    case tags.applyChanges:
      return {
        _tag: tags.applyChanges,
        toDbid: hexToBytes(parsed.toDbid),
        fromDbid: hexToBytes(parsed.fromDbid),
        schemaVersion: BigInt(parsed.schemaVersion),
        seqStart: [BigInt(parsed.seqStart[0]), parsed.seqStart[1]],
        seqEnd: [BigInt(parsed.seqEnd[0]), parsed.seqEnd[1]],
        changes: decodeChanges(parsed.changes),
      };
    case tags.getChanges:
      return {
        _tag: tags.getChanges,
        dbid: hexToBytes(parsed.dbid),
        requestorDbid: hexToBytes(parsed.requestorDbid),
        schemaVersion: BigInt(parsed.schemaVersion),
        since: [BigInt(parsed.since[0]), parsed.since[1]],
      };
    case tags.establishOutboundStream:
      return {
        _tag: tags.establishOutboundStream,
        toDbid: hexToBytes(parsed.toDbid),
        fromDbid: hexToBytes(parsed.fromDbid),
        schemaVersion: BigInt(parsed.schemaVersion),
        seqStart: [BigInt(parsed.seqStart[0]), parsed.seqStart[1]],
      };
    case tags.getLastSeen:
      return {
        _tag: tags.getLastSeen,
        toDbid: hexToBytes(parsed.toDbid),
        fromDbid: hexToBytes(parsed.fromDbid),
      };
    case tags.getLastSeenResponse:
      return {
        _tag: tags.getLastSeenResponse,
        seq: [BigInt(parsed.seq[0]), parsed.seq[1]],
      };
    case tags.getChangesResponse:
      return {
        _tag: tags.getChangesResponse,
        seqStart: [BigInt(parsed.seqStart[0]), parsed.seqStart[1]],
        seqEnd: [BigInt(parsed.seqEnd[0]), parsed.seqEnd[1]],
        changes: decodeChanges(parsed.changes),
      };
    case tags.createOrMigrate:
      return {
        _tag: tags.createOrMigrate,
        dbid: hexToBytes(parsed.dbid),
        requestorDbid: hexToBytes(parsed.requestorDbid),
        schemaName: parsed.schemaName,
        schemaVersion: BigInt(parsed.schemaVersion),
      };
    case tags.createOrMigrateResponse:
      return {
        _tag: tags.createOrMigrateResponse,
        status: parsed.status,
        seq: [BigInt(parsed.seq[0]), parsed.seq[1]],
      };
    case tags.ackChanges:
      return {
        _tag: tags.ackChanges,
        seqEnd: [BigInt(parsed.seqEnd[0]), parsed.seqEnd[1]],
      };
    case tags.applyChangesResponse:
      return {
        _tag: tags.applyChangesResponse,
      };
    case tags.streamingChanges:
      return {
        _tag: tags.streamingChanges,
        seqStart: [BigInt(parsed.seqStart[0]), parsed.seqStart[1]],
        seqEnd: [BigInt(parsed.seqEnd[0]), parsed.seqEnd[1]],
        changes: decodeChanges(parsed.changes),
      };
    case tags.establishOutboundStreamResponse:
      return parsed as Msg;
    case tags.uploadSchema:
      return parsed as Msg;
    case tags.activateSchema:
      return parsed as Msg;
  }
}

function decodeChanges(changes: any[]): Change[] {
  return changes.map((c) => {
    return [c[0], c[1], c[2], c[3], BigInt(c[4]), BigInt(c[5])];
  });
}
