'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Comment } from '@/types';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { useComments, useCreateComment } from '../../hooks/UseComments';
import { Spinner } from '@/components/ui/Spinner';
import { MessageCircle } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { data: session } = useSession();
  const { data: comments, isLoading } = useComments(postId);
  const { mutate: createComment } = useCreateComment();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmit = (content: string, parentId?: string) => {
    createComment(
      { postId, content, parentId },
      {
        onSuccess: () => {
          setReplyingTo(null);
        },
      }
    );
  };

  // Organize comments into a tree structure
  const organizeComments = (comments: Comment[]) => {
    const commentMap = new Map<string, Comment & { replies: Comment[] }>();
    const rootComments: (Comment & { replies: Comment[] })[] = [];

    // First pass: create map of all comments
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into tree
    comments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const organizedComments = comments ? organizeComments(comments) : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <MessageCircle className="text-gray-700" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">
          Comments ({comments?.length || 0})
        </h2>
      </div>

      {/* Comment Form */}
      {session ? (
        <CommentForm onSubmit={(content) => handleSubmit(content)} />
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-gray-600">
            Please sign in to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {organizedComments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          organizedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={(commentId) => setReplyingTo(commentId)}
              replyingTo={replyingTo}
              onSubmitReply={handleSubmit}
            />
          ))
        )}
      </div>
    </div>
  );
}