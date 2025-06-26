import { getPosts } from '@/lib/getPosts';
import { PostList } from '@/components/PostList';

export default async function FetchServerPage() {
  const posts = await getPosts();

  return (
    <main className="p-4">
      <h1>Posts da API Pública (JSONPlaceholder)</h1>
      <PostList posts={posts} />
      <a
        href="https://jsonplaceholder.typicode.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Ver documentação da API pública
      </a>
    </main>
  );
}
