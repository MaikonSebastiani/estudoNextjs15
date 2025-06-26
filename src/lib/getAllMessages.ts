'use server';

import { openDb } from './db';
import { MessageData } from '@/types/message';

export type MessageRow = MessageData & { id: number };

export async function getAllMessages(page: number = 1, limit: number = 10): Promise<{
  messages: MessageRow[];
  totalMessages: number;
  totalPages: number;
  currentPage: number;
}> {
  const db = await openDb();
  
  // Calcula o offset
  const offset = (page - 1) * limit;
  
  // Busca as mensagens com paginação
  const messages = await db.all<MessageRow[]>(
    'SELECT id, name, message FROM messages ORDER BY id DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );
  
  // Conta o total de mensagens
  const totalResult = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM messages');
  const totalMessages = totalResult?.count || 0;
  const totalPages = Math.ceil(totalMessages / limit);
  
  return {
    messages,
    totalMessages,
    totalPages,
    currentPage: page
  };
}
