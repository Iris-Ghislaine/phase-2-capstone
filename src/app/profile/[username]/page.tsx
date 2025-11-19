// import { NextResponse } from 'next/server';
// import { prisma } from '../../../lib/prisma';

// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ username: string }> } // FIXED
// ) {
//   try {
//     const { username } = await params; // FIXED: await params
    
//     const user = await prisma.user.findUnique({
//       where: { username },
//       select: {
//         id: true,
//         name: true,
//         username: true,
//         bio: true,
//         avatar: true,
//         createdAt: true,
//         _count: {
//           select: {
//             posts: true,
//             followers: true,
//             following: true,
//           },
//         },
//       },
//     });

//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     return NextResponse.json(user);
//   } catch (error) {
//     console.error('Fetch user error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { PostList } from '../../../components/post/PostLists';
import { Spinner } from '@/components/ui/Spinner';
import { MapPin, Link as LinkIcon, Calendar, Edit } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToggleFollow } from '../../../hooks/UseFollow';

async function fetchUser(username: string) {
  const res = await fetch(`/api/users/${username}`);
  if (!res.ok) throw new Error('User not found');
  return res.json();
}

async function fetchUserPosts(username: string) {
  const res = await fetch(`/api/posts?username=${username}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { data: session } = useSession();
  const [username, setUsername] = useState<string>('');
  
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
        <p>User not found</p>
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
                  <Button variant="outline" size="sm">
                    <Edit size={18} className="mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    variant={user.isFollowing ? "outline" : "primary"}
                    size="sm"
                    onClick={() => toggleFollow(user.id)}
                  >
                    {user.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>

              {user.bio && (
                <p className="text-gray-700 mb-4">{user.bio}</p>
              )}

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4">
                <div>
                  <span className="font-bold text-gray-900">{user._count.posts}</span>
                  <span className="text-gray-600 ml-1">Posts</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">{user._count.followers}</span>
                  <span className="text-gray-600 ml-1">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">{user._count.following}</span>
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
              Posts
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
          <PostList posts={posts || []} isLoading={postsLoading} variant="compact" />
        ) : (
          <div className="bg-white rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About {user.name}</h2>
            <p className="text-gray-700">
              {user.bio || 'No bio available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}