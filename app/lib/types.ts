export interface Post {
    slug: string;
    username: string;
    title: string;
    content: string;
    heartCount?: number;
    published?: boolean;
    createdAt: number;  
    updatedAt?: number;
  }
  
  export interface PostFeedProps {
    posts: Post[];
    admin?: boolean;
  }
  
  export interface PostItemProps {
    post: Post;
    admin?: boolean;
  }