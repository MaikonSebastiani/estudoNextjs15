'use server';

import { openDb } from './db';
import { MessageData } from '@/types/message';

export type MessageRow = MessageData & { id: number };

export async function getAllMessages(): Promise<MessageRow[]> {
  const db = await openDb();
  // Busca todos ordenados do mais recente para o mais antigo
  const messages = await db.all<MessageRow[]>('SELECT id, name, message FROM messages ORDER BY id DESC');
  return messages;
}
