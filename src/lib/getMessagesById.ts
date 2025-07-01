'use server';

import { openDb } from './db';
import { MessageData } from '@/types/message';

export type MessageRow = MessageData & { id: number };

export async function getMessagesById(id: number): Promise<{
  message: MessageRow | null;
  success: boolean;
  error?: string;
}> {
  try {
    const db = await openDb();
   
    // Busca uma única mensagem pelo ID
    const message = await db.get<MessageRow>(
      'SELECT id, name, message FROM messages WHERE id = ?',
      [id]
    );
    
    if (!message) {
      return {
        message: null,
        success: false,
        error: 'Mensagem não encontrada'
      };
    }
    
    return {
      message,
      success: true
    };
  } catch (error) {
    console.error('Erro ao buscar mensagem:', error);
    return {
      message: null,
      success: false,
      error: 'Erro interno do servidor'
    };
  }
}
