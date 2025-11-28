/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePost } from '../../../hooks/UsePosts';
import { PostActions } from '../../../components/post/PostAction';
import { CommentSection } from '@/components/comments/CommentSection';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatDate, readingTime } from '../../../lib/utils';
import { useToggleFollow } from '../../../hooks/UseFollow';

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { data: session } = useSession();
  const [slug, setSlug] = useState<string>('');
  
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  const { data: post, isLoading } = usePost(slug);
  const { mutate: toggleFollow } = useToggleFollow();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post not found</h1>
          <Link href="/">
            <Button variant="primary">Go home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = Boolean(session && (session.user as any)?.id === post.authorId);

  return (
    <article className="min-h-screen bg-white">
      {post.coverImage && (
        <div className="relative w-full h-[500px]">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between mb-8 pb-8 border-b">
            <div className="flex items-center gap-4">
              <Link href={`/profile/${post.author.username}`}>
                <Avatar src={post.author.avatar} size="lg" />
              </Link>
              <div>
                <Link href={`/profile/${post.author.username}`}>
                  <p className="font-semibold text-gray-900 hover:text-orange-600 transition-colors">
                    {post.author.name}
                  </p>
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                </div>
              </div>
            </div>

            {!isAuthor && session && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => toggleFollow(post.authorId)}
              >
                Follow
              </Button>
            )}
          </div>
        </header>

        

        <div
          className="prose prose-lg max-w-none mt-12 mb-16"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Link key={tag.id} href={`/tag/${tag.slug}`}>
                  <Badge variant="primary">{tag.name}</Badge>
                </Link>
              ))}
            </div>
          )}
<PostActions post={post} isAuthor={isAuthor} />
        <div className="mt-16 pt-16 border-t">
          <CommentSection postId={post.id} />
        </div>
      </div>
    </article>
  );
}
