'use client';

import React from 'react';
import { usePosts } from '../../hooks/UsePosts';
import { PostList } from '../../components/post/PostLists';
import { Sidebar } from '../../components/layouts/Sidebar';
import { TrendingUp } from 'lucide-react';

export default function TrendingPage() {
  const { data: posts, isLoading } = usePosts(true);
  const trendingPosts = posts?.sort((a, b) => 
    (b._count?.likes || 0) - (a._count?.likes || 0)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-lg">
                <TrendingUp className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Trending</h1>
                <p className="text-gray-600">Most popular posts this week</p>
              </div>
            </div>
            <PostList posts={trendingPosts || []} isLoading={isLoading} variant="featured" />
          </div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
