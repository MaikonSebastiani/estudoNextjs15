'use client';

import { useState, useTransition, useEffect } from 'react';
import { saveMessageSqlite } from '@/lib/saveMessageSqlite';
import { getAllMessages, MessageRow } from '@/lib/getAllMessages';
import { MessageData } from '@/types/message';
import { deleteMessage } from '@/lib/DeleteMessage';
import { editMessage } from '@/lib/editMessage';

export function FormSQLite() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<MessageRow | undefined>(undefined);

  // Estados para controlar os valores dos campos do formulário
  const [nameValue, setNameValue] = useState('');
  const [messageValue, setMessageValue] = useState('');

  // Novos estados para listar mensagens
  const [messages, setMessages] = useState<MessageRow[] | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const data: MessageData = {
      name: nameValue,
      message: messageValue,
    };

    startTransition(async () => {
      if (editingMessage) {
        // Modo de edição
        const res = await editMessage(editingMessage.id, data);
        setResult(res.success ? 'Mensagem atualizada no banco!' : `Erro: ${res.error}`);
        if (res.success) {
          setEditingMessage(undefined);
          setNameValue('');
          setMessageValue('');
        }
      } else {
        // Modo de criação
        const res = await saveMessageSqlite(data);
        setResult(res.success ? 'Mensagem salva no banco!' : `Erro: ${res.error}`);
        if (res.success) {
          setNameValue('');
          setMessageValue('');
        }
      }
      // Atualiza mensagens após salvar/editar
      if (messages) await handleFetchMessages();
    });
  }

  async function handleFetchMessages() {
    setLoadingMessages(true);
    const msgs = await getAllMessages();
    setMessages(msgs);
    setLoadingMessages(false);
  }

  async function handleDeleteMessage(id: number) {
    await deleteMessage(id);
    await handleFetchMessages();
  }

  function handleEditMessage(msg: MessageRow) {
    setEditingMessage(msg);
  }

  function handleCancelEdit() {
    setEditingMessage(undefined);
    setNameValue('');
    setMessageValue('');
    setResult(null);
  }

  useEffect(() => {
    if (editingMessage) {
      setNameValue(editingMessage.name);
      setMessageValue(editingMessage.message);
    }
  }, [editingMessage]);

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300 }}>
        <input 
          name="name" 
          placeholder="Seu nome" 
          required 
          className="border border-gray-300 p-2 rounded-md"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
        />
        <textarea 
          name="message" 
          placeholder="Sua mensagem" 
          required 
          className="border border-gray-300 p-2 rounded-md"
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
        />
        <div className="flex gap-2">
          <button type="submit" disabled={pending} className="bg-green-500 text-white p-2 rounded-md flex-1">
            {pending ? (editingMessage ? 'Atualizando...' : 'Salvando...') : (editingMessage ? 'Atualizar' : 'Salvar Mensagem')}
          </button>
          {editingMessage && (
            <button type="button" onClick={handleCancelEdit} className="bg-gray-500 text-white p-2 rounded-md">
              Cancelar
            </button>
          )}
        </div>
        {result && <p>{result}</p>}
      </form>

      <div className="mt-8 w-full flex flex-col items-center justify-center">
        <button onClick={handleFetchMessages} disabled={loadingMessages} className="mb-4 bg-blue-500 text-white p-2 rounded-md">
          {loadingMessages ? 'Buscando mensagens...' : 'Ver todas as mensagens salvas'}
        </button>
        {messages && messages.length === 0 && <p>Nenhuma mensagem encontrada.</p>}
        {messages && messages.length > 0 && (
          <ul>
            {messages.map((msg) => (
              <li key={msg.id} style={{ marginBottom: 12 }} className="flex items-center flex-col justify-between">
                <b>{msg.name}</b>
                <p>{msg.message}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleDeleteMessage(msg.id)} className="bg-red-500 text-white p-2 rounded-md">Deletar</button>
                  <button onClick={() => handleEditMessage(msg)} className="bg-yellow-500 text-white p-2 rounded-md">Editar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
