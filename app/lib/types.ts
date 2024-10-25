//app/lib/types.ts

import { Timestamp, FieldValue } from 'firebase/firestore';

export interface Post {
  slug: string;
  username: string;
  title: string;
  content: string;
  heartCount?: number;
  published?: boolean;
  createdAt: number | Timestamp;  
  updatedAt?: number | Timestamp;
  uid?: string;  // Make uid optional to maintain compatibility
}
  
  export interface PostFeedProps {
    posts: Post[];
    admin?: boolean;
  }
  
  export interface PostItemProps {
    post: Post;
    admin?: boolean;
  }

  // Add this new type for the create post form
  export interface CreatePostData {
    title: string;
    slug: string;
    uid: string;
    username: string;
    published: boolean;
    content: string;
    createdAt: FieldValue;
    updatedAt: FieldValue;
    heartCount: number;
  }