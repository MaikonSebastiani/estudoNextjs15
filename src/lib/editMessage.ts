'use server';

import { openDb } from './db';
import { MessageData } from '@/types/message';

export type MessageRow = MessageData & { id: number };

export async function editMessage(id: number, data: MessageData): Promise<{ success: boolean; error?: string }> {
  try {
    const db = await openDb();
    await db.run('UPDATE messages SET name = ?, message = ? WHERE id = ?', data.name, data.message, id);
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
