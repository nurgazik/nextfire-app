// app/[username]/[slug]/PostContent.tsx
'use client';

import Link from 'next/link';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { Post } from '@/app/lib/types';
import ReactMarkdown from 'react-markdown';
import Loader from '@/app/components/Loader';

interface PostContentProps {
  post: Post;
  postRef: string;
}

export default function PostContent({ post: initialPost, postRef }: PostContentProps) {
  // Realtime post data
  const [realtimeDoc, loading] = useDocument(doc(db, postRef));
  
  const post = realtimeDoc 
    ? {
        ...realtimeDoc.data() as Post,
        createdAt: realtimeDoc.data()?.createdAt?.toMillis() || 0,
        updatedAt: realtimeDoc.data()?.updatedAt?.toMillis() || 0,
      }
    : initialPost;

  const createdAt = typeof post?.createdAt === 'number' 
    ? new Date(post.createdAt)
    : post.createdAt;

  return (
    <div className="prose prose-lg max-w-4xl mx-auto">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written by{' '}
        <Link href={`/${post.username}/`} className="text-blue-600 hover:text-blue-800">
          @{post.username}
        </Link>{' '}
        on {createdAt.toISOString().split('T')[0]}
      </span>

      {loading ? (
        <Loader show={true} />
      ) : (
        <ReactMarkdown className="mt-8">
          {post?.content}
        </ReactMarkdown>
      )}

      <aside className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>
      </aside>
    </div>
  );
}