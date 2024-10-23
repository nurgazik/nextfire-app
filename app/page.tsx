import Image from "next/image";
import Link from 'next/link';
import Loader from "./components/Loader";
import { Timestamp, collection, collectionGroup, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { db } from '../app/lib/firebase'
import PostFeed from '../app/components/PostFeed';
import { Post } from '../app/lib/types'
import { postToJSON } from '../app/lib/firebase';
import { useState } from 'react';
import HomeContent from "./components/HomeContent";

const POSTS_PER_PAGE = 5;

// Types
interface HomePageProps {
  initialPosts: Post[];
}

async function getInitialPosts(): Promise<Post[]> {
  const postsQuery = query(
    collectionGroup(db, 'posts'),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(POSTS_PER_PAGE)
  );

  const snapshot = await getDocs(postsQuery);
  return snapshot.docs.map(postToJSON);
}

export default async function HomePage() {
  const initialPosts = await getInitialPosts();
  return <HomeContent initialPosts={initialPosts} />;
}