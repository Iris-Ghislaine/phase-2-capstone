/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Comment } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { CommentForm } from './CommentForm';
import { MessageCircle, MoreHorizontal, Trash2, Flag } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { useDeleteComment } from '../../hooks/UseComments';
import { useToast } from '../../context/ToastContext';

interface CommentItemProps {
  comment: Comment & { replies: Comment[] };
  onReply: (commentId: string) => void;
  replyingTo: string | null;
  onSubmitReply: (content: string, parentId: string) => void;
  depth?: number;
}

export function CommentItem({
  comment,
  onReply,
  replyingTo,
  onSubmitReply,
  depth = 0,
}: CommentItemProps) {
  const { data: session } = useSession();
  const toast = useToast();
  const { mutate: deleteComment } = useDeleteComment();
  const [showMenu, setShowMenu] = useState(false);
  const isAuthor = session?.user && (session.user as any).id === comment.authorId;
  const maxDepth = 3;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment(comment.id);
      setShowMenu(false);
    }
  };

  return (
    <div className={`${depth > 0 ? 'ml-12' : ''}`}>
      <div className="flex gap-4">
        {/* Avatar */}
        <Avatar src={comment.author.avatar} size="md" className="flex-shrink-0" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-medium text-gray-900">{comment.author.name}</p>
              <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
            </div>

            {/* Menu */}
            {session && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <MoreHorizontal size={18} />
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      {isAuthor ? (
                        <button
                          onClick={handleDelete}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            toast.error('Report functionality coming soon');
                            setShowMenu(false);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                        >
                          <Flag size={16} />
                          Report
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Comment Text */}
          <p className="text-gray-700 mb-3 whitespace-pre-wrap">{comment.content}</p>

          {/* Actions */}
          {session && depth < maxDepth && (
            <button
              onClick={() => onReply(comment.id)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors"
            >
              <MessageCircle size={16} />
              Reply
            </button>
          )}

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-4">
              <CommentForm
                onSubmit={(content) => onSubmitReply(content, comment.id)}
                onCancel={() => onReply(null as any)}
                placeholder="Write a reply..."
                autoFocus
              />
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-6 space-y-6">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply as any}
                  onReply={onReply}
                  replyingTo={replyingTo}
                  onSubmitReply={onSubmitReply}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
