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

  // Estados para listar mensagens com paginação
  const [messages, setMessages] = useState<MessageRow[] | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const messagesPerPage = 2; // Definindo 2 mensagens por página

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
      if (messages) await handleFetchMessages(currentPage);
    });
  }

  async function handleFetchMessages(page: number = 1) {
    setLoadingMessages(true);
    const result = await getAllMessages(page, messagesPerPage);
    setMessages(result.messages);
    setTotalPages(result.totalPages);
    setTotalMessages(result.totalMessages);
    setCurrentPage(result.currentPage);
    setLoadingMessages(false);
  }

  async function handleDeleteMessage(id: number) {
    await deleteMessage(id);
    // Após deletar, verificar se a página atual ainda tem mensagens
    const result = await getAllMessages(currentPage, messagesPerPage);
    if (result.messages.length === 0 && currentPage > 1) {
      // Se não há mensagens na página atual e não é a primeira página, voltar para a página anterior
      await handleFetchMessages(currentPage - 1);
    } else {
      await handleFetchMessages(currentPage);
    }
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

  function handlePreviousPage() {
    if (currentPage > 1) {
      handleFetchMessages(currentPage - 1);
    }
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      handleFetchMessages(currentPage + 1);
    }
  }

  function handleGoToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      handleFetchMessages(page);
    }
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
        <button onClick={() => handleFetchMessages(1)} disabled={loadingMessages} className="mb-4 bg-blue-500 text-white p-2 rounded-md">
          {loadingMessages ? 'Buscando mensagens...' : 'Ver todas as mensagens salvas'}
        </button>
        
        {messages && totalMessages > 0 && (
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600">
              Total de mensagens: {totalMessages} | Página {currentPage} de {totalPages}
            </p>
          </div>
        )}

        {messages && messages.length === 0 && totalMessages === 0 && <p>Nenhuma mensagem encontrada.</p>}
        
        {messages && messages.length > 0 && (
          <>
            <ul className="w-full max-w-md">
              {messages.map((msg) => (
                <li key={msg.id} style={{ marginBottom: 12 }} className="flex items-center flex-col justify-between border p-4 rounded-md">
                  <b>{msg.name}</b>
                  <p>{msg.message}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleDeleteMessage(msg.id)} className="bg-red-500 text-white p-2 rounded-md">Deletar</button>
                    <button onClick={() => handleEditMessage(msg)} className="bg-yellow-500 text-white p-2 rounded-md">Editar</button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Controles de Paginação */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center gap-2">
                <button 
                  onClick={handlePreviousPage} 
                  disabled={currentPage === 1 || loadingMessages}
                  className="bg-gray-500 text-white p-2 rounded-md disabled:bg-gray-300"
                >
                  Anterior
                </button>
                
                {/* Números das páginas */}
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handleGoToPage(pageNumber)}
                      disabled={loadingMessages}
                      className={`p-2 rounded-md ${
                        pageNumber === currentPage
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleNextPage} 
                  disabled={currentPage === totalPages || loadingMessages}
                  className="bg-gray-500 text-white p-2 rounded-md disabled:bg-gray-300"
                >
                  Próximo
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
