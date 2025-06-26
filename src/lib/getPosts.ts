// lib/getPosts.ts
import { Post } from '@/types/post';

export async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Erro ao buscar os posts');

  return res.json();
}
