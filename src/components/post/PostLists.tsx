'use client';

import React, { useState } from 'react';
import { Post } from '@/types';
import { PostCard } from './PostCard';
import { Spinner } from '@/components/ui/Spinner';

interface PostListProps {
  posts: Post[];
  isLoading?: boolean;
  variant?: 'default' | 'featured' | 'compact';
}

export function PostList({ posts, isLoading, variant = 'default' }: PostListProps) {
  const [displayCount, setDisplayCount] = useState(10);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No posts found</p>
      </div>
    );
  }

  const visiblePosts = posts.slice(0, displayCount);
  const hasMore = posts.length > displayCount;

  return (
    <div className="space-y-6">
      {variant === 'featured' && visiblePosts[0] && (
        <PostCard post={visiblePosts[0]} variant="featured" />
      )}
      
      <div className={variant === 'compact' ? 'space-y-2' : 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'}>
        {(variant === 'featured' ? visiblePosts.slice(1) : visiblePosts).map((post) => (
          <PostCard key={post.id} post={post} variant={variant} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={() => setDisplayCount((prev) => prev + 10)}
            className="px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
