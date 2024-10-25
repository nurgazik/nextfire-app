// app/admin/page.tsx
'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, doc, setDoc, query, orderBy, where } from 'firebase/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';

import { auth, db, serverTimestamp } from '../lib/firebase'
import { UserContext } from '../lib/context';
import AuthCheck from '../components/AuthCheck';
import PostFeed from '../components/PostFeed';
import { CreatePostData } from '../lib/types';
import {Post} from '../lib/types'

export default function AdminPostsPage() {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const postsRef = collection(db, 'posts');
  const postsQuery = query(
    postsRef,
    where('uid', '==', auth.currentUser?.uid),
    orderBy('createdAt', 'desc')
  );
  
  const [querySnapshot] = useCollection(postsQuery);
  const posts = querySnapshot?.docs.map((doc): Post => {
    const data = doc.data();
    return {
      slug: data.slug,
      username: data.username,
      title: data.title,
      content: data.content,
      heartCount: data.heartCount,
      published: data.published,
      uid: data.uid,
      createdAt: data.createdAt?.toMillis() || 0,
      updatedAt: data.updatedAt?.toMillis() || 0
    };
  }) || [];

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}


function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState('');

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid;
    
    if (!uid || !username) {
      toast.error('Must be logged in!');
      return;
    }

    const postRef = doc(db, 'posts', slug);

    // Tip: give all fields a default value here
    const data: CreatePostData = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    try {
      await setDoc(postRef, data);
      toast.success('Post created!');
      // Imperative navigation after doc is set
      router.push(`/admin/${slug}`);
    } catch (err) {
      toast.error('Failed to create post!');
      console.error(err);
    }
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className="input"
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}