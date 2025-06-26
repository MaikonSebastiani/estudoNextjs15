'use server';

import { openDb } from './db';
import { MessageData } from '@/types/message';

export async function saveMessageSqlite(data: MessageData): Promise<{ success: boolean; error?: string }> {
  try {
    const db = await openDb();
    await db.run('INSERT INTO messages (name, message) VALUES (?, ?)', data.name, data.message);
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
