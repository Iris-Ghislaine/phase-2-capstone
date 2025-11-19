'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';

async function toggleFollow(userId: string): Promise<{ following: boolean }> {
  const res = await fetch('/api/follow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error('Failed to toggle follow');
  return res.json();
}

export function useToggleFollow() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: toggleFollow,
    onSuccess: (data, userId) => {
      // Invalidate user queries by username pattern
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'following'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success(data.following ? 'Followed successfully!' : 'Unfollowed');
    },
    onError: () => {
      toast.error('Failed to follow/unfollow');
    },
  });
}
