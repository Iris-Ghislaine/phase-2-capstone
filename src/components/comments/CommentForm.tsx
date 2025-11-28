'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function CommentForm({
  onSubmit,
  onCancel,
  placeholder = 'What are your thoughts?',
  autoFocus = false,
}: CommentFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(autoFocus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onSubmit(content);
    setContent('');
    setIsFocused(false);
  };

  if (!session) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <Avatar src={session.user?.image || undefined} size="md" className="flex-shrink-0" />
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            rows={isFocused ? 4 : 2}
            autoFocus={autoFocus}
            className="resize-none"
          />
        </div>
      </div>

      {isFocused && (
        <div className="flex items-center gap-3 justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!content.trim()}
          >
            {onCancel ? 'Reply' : 'Comment'}
          </Button>
        </div>
      )}
    </form>
  );
}