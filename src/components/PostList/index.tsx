// components/PostList.tsx
import { Post } from '@/types/post';

type PostListProps = {
  posts: Post[];
};

export function PostList({ posts }: PostListProps) {
  return (
    <ul>
      {posts.slice(0, 5).map((post) => (
        <li key={post.id} style={{ marginBottom: 16 }}>
          <strong>{post.title}</strong>
          <p>{post.body}</p>
          <small>
            <strong>User ID:</strong> {post.userId}
          </small>
        </li>
      ))}
    </ul>
  );
}
