"use client";

import Header from "@/components/Header";
import { editMessage } from "@/lib/editMessage";
import { getMessagesById, MessageRow } from "@/lib/getMessagesById";
import { useState, useEffect } from "react";

type EditMessagePageProps = {
  params: Promise<{
    id: number;
  }>
}

export default function EditMessagePage({params}: EditMessagePageProps) {
  const [message, setMessage] = useState<MessageRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params;
        const messageId = resolvedParams.id;
        setId(messageId);
        
        const res = await getMessagesById(messageId);
        
        if (res.success && res.message) {
          setMessage(res.message);
        } else {
          setError(res.error || 'Erro ao carregar mensagem');
        }
      } catch (err) {
        setError('Erro ao carregar mensagem');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !message) return;
    
    const fetchData = async () => {
      const res = await editMessage(id, message);
      alert("mensagem atualizada com sucesso");
    }
    fetchData();
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (message) {
      setMessage({
        ...message,
        name: e.target.value
      });
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (message) {
      setMessage({
        ...message,
        message: e.target.value
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Header>
          Carregando...
        </Header>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Header>
          Erro: {error}
        </Header>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Header>
          Mensagem não encontrada
        </Header>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Header>
        Você está editando o post de id: {id}
      </Header>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-white font-medium mb-2">Nome</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            className="w-full text-white px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={message.name} 
            onChange={handleNameChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-white font-medium mb-2">Mensagem</label>
          <textarea 
            id="message" 
            name="message" 
            className="w-full px-3 py-2 border border-gray-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={message.message} 
            onChange={handleMessageChange}
          />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
          Editar
        </button>
      </form>
    </div>
  )
}

