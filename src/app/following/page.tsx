'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { PostList } from '../../components/post/PostLists';
import { Sidebar } from '../../components/layouts/Sidebar';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Users, Heart } from 'lucide-react';
import Link from 'next/link';

async function fetchFollowingPosts() {
  const res = await fetch('/api/posts/following');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default function FollowingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', 'following'],
    queryFn: fetchFollowingPosts,
    enabled: !!session,
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-gradient-to-r from-orange-500 to-blue-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sign in to see posts from people you follow
          </h1>
          <p className="text-gray-600 mb-8">
            Follow your favorite writers and stay updated with their latest stories.
          </p>
          <Link href="/login">
            <Button variant="primary" size="lg">
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-r from-orange-500 to-blue-900 p-3 rounded-lg">
                <Heart className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Following</h1>
                <p className="text-gray-600">Posts from people you follow</p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : !posts || posts.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <Users className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start following writers to see their posts here
                </p>
                <Link href="/">
                  <Button variant="primary">Discover writers</Button>
                </Link>
              </div>
            ) : (
              <PostList posts={posts} isLoading={false} />
            )}
          </div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
