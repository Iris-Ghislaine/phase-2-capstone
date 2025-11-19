'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { formatDate, readingTime, truncate } from '@/lib/utils';
import { useToggleLike } from '../../hooks/UseLikes';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'featured' | 'compact';
}

export function PostCard({ post, variant = 'default' }: PostCardProps) {
  const { mutate: toggleLike } = useToggleLike();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(post.id);
  };

  if (variant === 'featured') {
    return (
      <Link href={`/post/${post.slug}`}>
        <article className="group cursor-pointer">
          <div className="relative h-96 rounded-2xl overflow-hidden mb-6">
            {post.coverImage && (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Avatar src={post.author.avatar} size="md" />
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-sm text-gray-300">{formatDate(post.createdAt)}</p>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-3 line-clamp-2 group-hover:text-green-400 transition-colors">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-gray-200 line-clamp-2 mb-4">{post.excerpt}</p>
              )}
              <div className="flex items-center gap-4">
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag.id} variant="primary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/post/${post.slug}`}>
        <article className="group flex gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
          {post.coverImage && (
            <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-green-600 transition-colors">
              {post.title}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{post.author.name}</span>
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/post/${post.slug}`}>
      <article className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
        {post.coverImage && (
          <div className="relative h-56 overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6">
          {/* Author Info */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar src={post.author.avatar} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{post.author.name}</p>
              <p className="text-sm text-gray-500">
                {formatDate(post.createdAt)} · {readingTime(post.content)} min read
              </p>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="default">
                {tag.name}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
              >
                <Heart
                  size={20}
                  className={post.isLiked ? 'fill-red-500 text-red-500' : ''}
                />
                <span className="text-sm">{post._count?.likes || 0}</span>
              </button>
              <div className="flex items-center gap-2 text-gray-500">
                <MessageCircle size={20} />
                <span className="text-sm">{post._count?.comments || 0}</span>
              </div>
            </div>
            <button className="text-gray-500 hover:text-gray-700 transition-colors">
              <Bookmark size={20} />
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
