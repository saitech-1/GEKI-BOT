#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/3fed8a7da67175e4e394ab46e5552c8f3f31f75ca76ae15836a0aea5fc6e2053/contract';
import startContract from '../../snapshots/3fed8a7da67175e4e394ab46e5552c8f3f31f75ca76ae15836a0aea5fc6e2053/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/47ce1128fee6c7a2cb59a258f954c20b7910843163e0c63a1fda81a153086751/contract';
import endContract from '../../snapshots/47ce1128fee6c7a2cb59a258f954c20b7910843163e0c63a1fda81a153086751/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'xpTransaction',
        columns: [
          col('amount', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('reason', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('level', 'int4', {
          notNull: true,
          default: lit(1),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('xp', 'int4', {
          notNull: true,
          default: lit(0),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
      this.createIndex({
        schema: 'public',
        table: 'xpTransaction',
        index: 'xpTransaction_createdAt_idx_9575dbd7',
        columns: ['createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'xpTransaction',
        index: 'xpTransaction_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'xpTransaction',
        foreignKey: {
          name: 'xpTransaction_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.enableRowLevelSecurity({ schema: 'public', table: 'fighterProfile' }),
      this.enableRowLevelSecurity({ schema: 'public', table: 'user' }),
      this.enableRowLevelSecurity({ schema: 'public', table: 'xpTransaction' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
