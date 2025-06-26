// lib/db.ts
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

// Função para abrir o banco e garantir a tabela
export async function openDb(): Promise<Database> {
  const db = await open({
    filename: path.resolve(process.cwd(), 'sqlite-db.sqlite'),
    driver: sqlite3.Database,
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL
    );
  `);
  return db;
}
