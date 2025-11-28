'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Post } from '@/types';
import { useToast } from '@/context/ToastContext';

async function fetchPosts(published: boolean = true): Promise<Post[]> {
  const res = await fetch(`/api/posts?published=${published}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

async function fetchPost(slug: string): Promise<Post> {
  const res = await fetch(`/api/posts/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
}

interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published: boolean;
  tags?: string[];
}

async function createPost(data: CreatePostData): Promise<Post> {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
}

interface UpdatePostData {
  title?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
  tags?: string[];
}

async function updatePost(id: string, data: UpdatePostData): Promise<Post> {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update post');
  return res.json();
}

async function deletePost(id: string): Promise<void> {
  const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete post');
}

export function usePosts(published: boolean = true) {
  return useQuery({
    queryKey: ['posts', published],
    queryFn: () => fetchPosts(published),
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => fetchPost(slug),
    enabled: !!slug,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post created successfully!');
    },
    onError: () => {
      toast.error('Failed to create post');
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostData }) =>
      updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update post');
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete post');
    },
  });
}
