'use client';

import React, { useState } from 'react';
import { PostList } from '../components/post/PostLists';
import { Sidebar } from '../components/layouts/Sidebar';
import { usePosts } from '../hooks/UsePosts';
import { TrendingUp, Clock, Star } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [filter, setFilter] = useState<'latest' | 'trending' | 'following'>('latest');
  const { data: posts, isLoading } = usePosts(true);

  const filters = [
    { id: 'latest', label: 'Latest', icon: Clock },
    // { id: 'trending', label: 'Trending', icon: TrendingUp },
    // { id: 'following', label: 'Following', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Stay curious.
            </h1>
            <p className="text-xl text-orange-100 mb-8">
              Discover stories, thinking, and expertise from writers on any topic.
            </p>
            <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Start reading
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Posts */}
          <div className="flex-1 min-w-0">
            {/* Filter Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200">
              {filters.map((f) => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.id}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onClick={() => setFilter(f.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                      filter === f.id
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={20} />
                    {f.label}
                  </button>
                );
              })}
            </div>

            <PostList posts={posts || []} isLoading={isLoading} variant="default" />
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
}