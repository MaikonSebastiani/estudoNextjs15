'use client';

import { useState, useTransition } from 'react';
import { saveMessageSqlite } from '@/lib/saveMessageSqlite';
import { MessageData } from '@/types/message';

export function FormSQLite() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data: MessageData = {
      name: formData.get('name') as string,
      message: formData.get('message') as string,
    };

    startTransition(async () => {
      const res = await saveMessageSqlite(data);
      setResult(res.success ? 'Mensagem salva no banco!' : `Erro: ${res.error}`);
      if (res.success) (e.target as HTMLFormElement).reset();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
      <input name="name" placeholder="Seu nome" required />
      <textarea name="message" placeholder="Sua mensagem" required />
      <button type="submit" disabled={pending}>
        {pending ? 'Salvando...' : 'Salvar Mensagem'}
      </button>
      {result && <p>{result}</p>}
    </form>
  );
}
