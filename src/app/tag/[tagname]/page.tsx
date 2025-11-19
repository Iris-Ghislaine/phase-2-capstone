'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PostList } from '../../../components/post/PostLists';
import { Spinner } from '@/components/ui/Spinner';
import { Tag } from 'lucide-react';

async function fetchPostsByTag(tagname: string) {
  const res = await fetch(`/api/posts?tag=${tagname}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default function TagPage({ params }: { params: Promise<{ tagname: string }> }) {
  const [tagname, setTagname] = useState<string>('');
  
  useEffect(() => {
    params.then((p) => setTagname(p.tagname));
  }, [params]);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', 'tag', tagname],
    queryFn: () => fetchPostsByTag(tagname),
    enabled: !!tagname,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-orange-600 p-3 rounded-lg">
            <Tag className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 capitalize">
              {tagname.replace('-', ' ')}
            </h1>
            <p className="text-gray-600">
              {posts?.length || 0} posts tagged with this topic
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <PostList posts={posts || []} isLoading={false} />
        )}
      </div>
    </div>
  );
}