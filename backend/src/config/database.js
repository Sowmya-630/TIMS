import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Ensure .env is loaded from backend root regardless of CWD
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const candidateEnvPaths = [
  join(__dirname, '../../.env'), // backend/.env
  join(process.cwd(), '.env'),   // current working dir
];

for (const envPath of candidateEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

const databaseFile = process.env.SQLITE_DB_PATH || join(__dirname, '../../subscription_management.db');

let dbPromise;
const getDb = async () => {
  if (!dbPromise) {
    dbPromise = open({ filename: databaseFile, driver: sqlite3.Database }).then(async (db) => {
      await db.exec('PRAGMA foreign_keys = ON');
      return db;
    });
  }
  return dbPromise;
};

// Test database connection
export const testConnection = async () => {
  try {
    const db = await getDb();
    await db.get('SELECT 1');
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Execute query with error handling
export const executeQuery = async (query, params = []) => {
  try {
    const db = await getDb();
    const trimmed = query.trim().toUpperCase();
    if (trimmed.startsWith('SELECT')) {
      return await db.all(query, params);
    } else if (trimmed.startsWith('INSERT') || trimmed.startsWith('UPDATE') || trimmed.startsWith('DELETE') || trimmed.startsWith('CREATE') || trimmed.startsWith('DROP') || trimmed.startsWith('ALTER')) {
      const result = await db.run(query, params);
      // Normalize to previous shape when code expects insertId / affectedRows
      let insertId = result.lastID;
      if (trimmed.startsWith('INSERT')) {
        // Try to return the logical id column for tables using TEXT ids with defaults
        const match = /INSERT\s+INTO\s+([`"]?)(\w+)\1/i.exec(query);
        if (match && match[2]) {
          const table = match[2];
          try {
            const row = await db.get(`SELECT id FROM ${table} ORDER BY rowid DESC LIMIT 1`);
            if (row && row.id) insertId = row.id;
          } catch {}
        }
      }
      return { insertId, affectedRows: result.changes };
    } else {
      return await db.all(query, params);
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Execute transaction
export const executeTransaction = async (queries) => {
  const db = await getDb();
  try {
    await db.exec('BEGIN');
    const results = [];
    for (const { query, params } of queries) {
      const upper = query.trim().toUpperCase();
      if (upper.startsWith('SELECT')) {
        results.push(await db.all(query, params));
      } else {
        const res = await db.run(query, params);
        results.push({ insertId: res.lastID, affectedRows: res.changes });
      }
    }
    await db.exec('COMMIT');
    return results;
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }
};

export default { getDb };
