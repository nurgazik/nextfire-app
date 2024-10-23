// app/[username]/page.tsx

import { getUserWithUsername, postToJSON, db } from '../lib/firebase';
import UserProfile from '../components/UserProfile';
import PostFeed from '../components/PostFeed';
import {
  collection,
  where,
  getDocs,
  query as firestoreQuery,
  limit,
  orderBy,
  CollectionReference,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

interface User {
  photoURL: string | null;
  username: string;
  displayName: string | null;
}

interface Post {
  slug: string;
  username: string;
  title: string;
  content: string;
  heartCount?: number;
  published?: boolean;
  createdAt: number;
  updatedAt?: number;
}

interface Params {
  username: string;
}

const UserProfilePage = async ({ params }: { params: Params }) => {
  const { username } = params;

  const userDoc = await getUserWithUsername(username);
  console.log("User Document:", userDoc); // Debug print statement

  let user: User | null = null;
  let posts: Post[] = [];

  if (userDoc) {
    user = userDoc.data() as User;

    const postsRef = collection(db, 'posts') as CollectionReference<DocumentData>;

    const postsQuery = firestoreQuery(
      postsRef,
      where('username', '==', username),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const postsSnapshot = await getDocs(postsQuery);
    console.log("Posts Snapshot:", postsSnapshot); // Debug print statement

    posts = postsSnapshot.docs.map((doc) => {
      const post = postToJSON(doc as QueryDocumentSnapshot);
      console.log("Post Data:", post); // Debug print statement for each post
      return post;
    });
    
  }

  return (
    <main>
      {user && <UserProfile user={user} />}
      {posts.length > 0 && <PostFeed posts={posts} />}
    </main>
  );
};

export default UserProfilePage;
