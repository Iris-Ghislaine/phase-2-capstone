export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
  _count?: {
    posts: number;
    followers: number;
    following: number;
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  author: User;
  authorId: string;
  tags: Tag[];
  _count?: {
    likes: number;
    comments: number;
  };
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: User;
  authorId: string;
  postId: string;
  parentId?: string;
  replies?: Comment[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}
