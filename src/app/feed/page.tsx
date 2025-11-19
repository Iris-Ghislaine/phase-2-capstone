'use client';

import { usePosts } from '../../hooks/UsePosts';
import { PostList } from '../../components/post/PostLists';
import { Sidebar } from '../../components/layouts/Sidebar';
import { Clock } from 'lucide-react';

export default function LatestFeedPage() {
  const { data: posts, isLoading } = usePosts(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-8">
              <Clock className="text-orange-600" size={32} />
              <h1 className="text-4xl font-bold text-gray-900">Latest Posts</h1>
            </div>
            <PostList posts={posts || []} isLoading={isLoading} />
          </div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}