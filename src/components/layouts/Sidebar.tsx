'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, Tag } from 'lucide-react';

const trendingTopics = [
  { name: 'Technology', slug: 'technology', count: 1234 },
  { name: 'Programming', slug: 'programming', count: 987 },
  { name: 'Design', slug: 'design', count: 756 },
  { name: 'Startup', slug: 'startup', count: 654 },
  { name: 'AI & ML', slug: 'ai-ml', count: 543 },
];

export function Sidebar() {
  return (
    <aside className="w-full lg:w-80 space-y-8">
      {/* Trending Topics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-green-600" size={20} />
          <h2 className="font-bold text-gray-900">Trending Topics</h2>
        </div>
        <div className="space-y-3">
          {trendingTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/tag/${topic.slug}`}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                <span className="font-medium text-gray-700 group-hover:text-green-600 transition-colors">
                  {topic.name}
                </span>
              </div>
              <span className="text-sm text-gray-400">{topic.count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended Topics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Recommended Topics</h2>
        <div className="flex flex-wrap gap-2">
          {['JavaScript', 'React', 'NextJS', 'TypeScript', 'CSS', 'Node.js', 'Python'].map((topic) => (
            <Link
              key={topic}
              href={`/tag/${topic.toLowerCase()}`}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-green-100 hover:text-green-700 transition-colors"
            >
              {topic}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}