'use server';

import { openDb } from './db';
import { MessageData } from '@/types/message';

export type MessageRow = MessageData & { id: number };

export async function getMessagesById(id: number): Promise<{
  messages: MessageRow[];
}> {
  const db = await openDb();
 
  
  // Busca as mensagens com paginação
  const messages = await db.all<MessageRow[]>(
    'SELECT id, name, message FROM messages WHERE id = ?',
    [id]
  );
  
  
  return {
    messages
  };
}
