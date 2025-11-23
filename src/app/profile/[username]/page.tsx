/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Edit, Heart, MessageCircle } from 'lucide-react';
import { formatDate, readingTime } from '@/lib/utils';
import { useToggleFollow } from '../../../hooks/UseFollow';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

async function fetchUser(username: string) {
  const res = await fetch(`/api/users/${username}`);
  if (!res.ok) throw new Error('User not found');
  return res.json();
}

async function fetchUserPosts(username: string) {
  const res = await fetch(`/api/users/${username}/posts`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { data: session } = useSession();
  const [username, setUsername] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    params.then((p) => setUsername(p.username));
  }, [params]);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', username],
    queryFn: () => fetchUser(username),
    enabled: !!username,
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['userPosts', username],
    queryFn: () => fetchUserPosts(username),
    enabled: !!username,
  });

  const { mutate: toggleFollow } = useToggleFollow();
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');

  if (!username || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">User not found</h1>
          <Link href="/">
            <Button variant="primary">Go home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = session && (session.user as any)?.username === username;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex items-start gap-8">
            <Avatar src={user.avatar} size="xl" />

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {user.name}
                  </h1>
                  <p className="text-gray-500">@{user.username}</p>
                </div>

                {isOwnProfile ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/profile/${username}/edit`)}
                  >
                    <Edit size={18} className="mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => toggleFollow(user.id)}
                  >
                    Follow
                  </Button>
                )}
              </div>

              {user.bio && <p className="text-gray-700 mb-4">{user.bio}</p>}

              <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <span className="font-bold text-gray-900 text-xl">
                    {user._count.posts}
                  </span>
                  <span className="text-gray-600 ml-1">
                    {user._count.posts === 1 ? 'Post' : 'Posts'}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-900 text-xl">
                    {user._count.followers}
                  </span>
                  <span className="text-gray-600 ml-1">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900 text-xl">
                    {user._count.following}
                  </span>
                  <span className="text-gray-600 ml-1">Following</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mt-8 border-b">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-4 font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Posts ({user._count.posts})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-4 font-medium transition-colors ${
                activeTab === 'about'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              About
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {activeTab === 'posts' ? (
          <div>
            {postsLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post: any) => (
                  <Link key={post.id} href={`/post/${post.slug}`}>
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col">
                      {/* Cover Image */}
                      {post.coverImage && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 2).map((tag: any) => (
                              <Badge key={tag.id} variant="default">
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between text-gray-500 text-sm pt-4 border-t border-gray-100">
                          <span>{formatDate(post.createdAt)}</span>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Heart size={16} />
                              <span>{post._count.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle size={16} />
                              <span>{post._count.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600 mb-6">
                  {isOwnProfile
                    ? "You haven't published any posts yet. Start writing to share your stories!"
                    : `${user.name} hasn't published any posts yet.`}
                </p>
                {isOwnProfile && (
                  <Link href="/new-story">
                    <Button variant="primary">Write your first story</Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About {user.name}
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {user.bio || 'No bio available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
