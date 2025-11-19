'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '../../types';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useToggleLike } from '../../hooks/UseLikes';
import { useDeletePost } from '../../hooks/UsePosts';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

interface PostActionsProps {
  post: Post;
  isAuthor?: boolean;
}

export function PostActions({ post, isAuthor }: PostActionsProps) {
  const router = useRouter();
  const toast = useToast();
  const { mutate: toggleLike } = useToggleLike();
  const { mutate: deletePost, isLoading: isDeleting } = useDeletePost();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLike = () => {
    toggleLike(post.id);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post.title,
        text: post.excerpt || '',
        url: window.location.href,
      });
    } catch (error) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDelete = () => {
    deletePost(post.id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        router.push('/');
      },
    });
  };

  return (
    <>
      <div className="flex items-center justify-between py-6 border-y border-gray-200">
        {/* Left Actions */}
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
          >
            <Heart
              size={24}
              className={post.isLiked ? 'fill-red-500 text-red-500' : ''}
            />
            <span className="font-medium">{post._count?.likes || 0}</span>
          </button>

          <button className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors">
            <MessageCircle size={24} />
            <span className="font-medium">{post._count?.comments || 0}</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <Bookmark size={22} />
          </button>

          <button
            onClick={handleShare}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Share2 size={22} />
          </button>

          {isAuthor && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreHorizontal size={22} />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <button
                      onClick={() => {
                        router.push(`/edit/${post.id}`);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <Edit size={18} />
                      <span>Edit post</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-red-600"
                    >
                      <Trash2 size={18} />
                      <span>Delete post</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Post"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}