'use server';

import { openDb } from './db';
import { MessageData } from '@/types/message';

export type MessageRow = MessageData & { id: number };

export async function deleteMessage(id: number): Promise<void> {
  const db = await openDb();
  await db.run('DELETE FROM messages WHERE id = ?', id);
}
