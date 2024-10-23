// app/components/HomeContent.tsx
'use client';

import { useState } from 'react';
import { Timestamp, collectionGroup, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { db } from '../lib/firebase'
import PostFeed from './PostFeed';
import Loader from './Loader';
import { Post } from '../lib/types';
import { postToJSON } from '../lib/firebase';

interface HomeContentProps {
    initialPosts: Post[];
  }
  
  // Make sure we're exporting the component properly
  export default function HomeContent({ initialPosts }: HomeContentProps) {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [loading, setLoading] = useState(false);
    const [postsEnd, setPostsEnd] = useState(false);
  
    const getMorePosts = async () => {
      setLoading(true);
      const last = posts[posts.length - 1];
  
      const cursor = Timestamp.fromMillis(last.createdAt);
  
      const postsQuery = query(
        collectionGroup(db, 'posts'),
        where('published', '==', true),
        orderBy('createdAt', 'desc'),
        startAfter(cursor),
        limit(5)
      );
  
      const snapshot = await getDocs(postsQuery);
      const newPosts = snapshot.docs.map(postToJSON);
  
      setPosts(posts.concat(newPosts));
      setLoading(false);
  
      if (newPosts.length < 5) {
        setPostsEnd(true);
      }
    };
  
    return (
      <main className="max-w-4xl mx-auto">
        <PostFeed posts={posts} />
  
        <div className="text-center mt-8">
          {!loading && !postsEnd && (
            <button
              onClick={getMorePosts}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Load more
            </button>
          )}
  
          <Loader show={loading} />
  
          {postsEnd && (
            <p className="text-gray-600 mt-4">You have reached the end!</p>
          )}
        </div>
      </main>
    );
  }