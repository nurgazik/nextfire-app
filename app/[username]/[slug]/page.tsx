// app/[username]/[slug]/page.tsx
import { getUserWithUsername } from '@/app/lib/firebase';
import { Post } from '@/app/lib/types';
import PostContent from './PostContent';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    username: string;
    slug: string;
  };
}

function convertFirestorePost(data: any): Post | null {
  if (!data) return null;

  return {
    ...data,
    createdAt: data.createdAt?.toMillis() || 0,
    updatedAt: data.updatedAt?.toMillis() || 0
  } as Post;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);
  
  if (!userDoc) {
    return {
      title: 'Post Not Found'
    };
  }

  // Query posts collection where slug matches
  const postsQuery = query(
    collection(db, 'posts'),
    where('slug', '==', slug),
    where('username', '==', username),
    limit(1)
  );

  const posts = await getDocs(postsQuery);
  const post = posts.docs[0]?.data();

  return {
    title: post?.title || 'Post',
    description: post?.content ? `${post.content.substring(0, 160)}...` : undefined
  };
}

export default async function PostPage({ params }: Props) {
  const { username, slug } = params;
  console.log('Looking for post:', { username, slug });

  const userDoc = await getUserWithUsername(username);

  if (!userDoc) {
    console.log('User not found');
    notFound();
  }

  // Query posts collection where slug matches
  const postsQuery = query(
    collection(db, 'posts'),
    where('slug', '==', slug),
    where('username', '==', username),
    limit(1)
  );

  const posts = await getDocs(postsQuery);
  
  if (posts.empty) {
    console.log('No matching post found');
    notFound();
  }

  const postDoc = posts.docs[0];
  const post = convertFirestorePost(postDoc.data());

  if (!post) {
    console.log('Failed to convert post data');
    notFound();
  }

  return <PostContent postRef={postDoc.ref.path} post={post} />;
}