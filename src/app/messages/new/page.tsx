'use client';
import Header from "@/components/Header";
import { saveMessageSqlite } from "@/lib/saveMessageSqlite";
import Link from "next/link";
import { useState, useTransition } from "react";

export default function NewMessagePage() {

  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    setName(formData.get('name') as string);
    setMessage(formData.get('message') as string);
    startTransition(async () => {
      if (name === '' || message === '') {
        alert('Por favor, preencha todos os campos');
        return;
      }

      const response = await saveMessageSqlite({name: name, message: message});
      if (response.success) {
        setName('');
        setMessage('');
      }
    });
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Header>
        Nova Mensagem
      </Header>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-white font-medium mb-2">Nome</label>
          <input type="text" id="name" name="name" className="w-full text-white px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-white font-medium mb-2">Mensagem</label>
          <textarea id="message" name="message" className="w-full px-3 py-2 border border-gray-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
          Enviar
        </button>
      </form>
    </div>
  )
}
