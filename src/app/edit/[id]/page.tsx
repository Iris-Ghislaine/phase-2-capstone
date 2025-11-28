/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { RichTextEditor } from '../../../components/editor/RichTextEditor';
import { ImageUpload } from '../../../components/editor/ImageUpload';
import { EditorToolbar } from '../../../components/editor/EditorToolBar';
import { TagInput } from '../../../components/editor/TagInput';
import { Input } from '../../../components/ui/Input';
import { useUpdatePost } from '../../../hooks/UsePosts';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '../../../context/ToastContext';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { data: session } = useSession();
  const toast = useToast();
  const { mutate: updatePost } = useUpdatePost();
  const [postId, setPostId] = useState<string>('');

  useEffect(() => {
    params.then((p) => setPostId(p.id));
  }, [params]);

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${postId}`);
      if (!res.ok) throw new Error('Failed to fetch post');
      return res.json();
    },
    enabled: !!postId,
  });
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: [] as string[],
    published: false,
  });

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    if (post) {
      // Check if user owns the post
      if ((session.user as any)?.id !== post.authorId) {
        toast.error('You do not have permission to edit this post');
        router.push(`/post/${post.slug}`);
        return;
      }

      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        coverImage: post.coverImage || '',
        tags: post.tags?.map((tag:any) => tag.name) || [],
        published: post.published || false,
      });
    }
  }, [post, session, router, toast]);

  if (!session || postLoading) {
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
          <Button variant="primary" onClick={() => router.push('/')}>
            Go home
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveDraft = async () => {
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    setIsSaving(true);
    updatePost(
      {
        id: postId,
        data: { 
          ...formData, 
          published: false,
          tags: formData.tags
        },
      },
      {
        onSuccess: () => {
          toast.success('Draft saved!');
          router.push('/drafts');
        },
        onSettled: () => setIsSaving(false),
      }
    );
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    if (!formData.excerpt) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formData.content;
      const text = tempDiv.textContent || tempDiv.innerText || '';
      formData.excerpt = text.substring(0, 200) + '...';
    }

    setIsPublishing(true);
    updatePost(
      {
        id: postId,
        data: { 
          ...formData, 
          published: true,
          tags: formData.tags
        },
      },
      {
        onSuccess: (data) => {
          toast.success('Post updated successfully!');
          router.push(`/post/${data.slug}`);
        },
        onSettled: () => {
          setIsPublishing(false);
          setShowPublishModal(false);
        },
      }
    );
  };

  return (
    <>
      <EditorToolbar
        onSaveDraft={handleSaveDraft}
        onPublish={() => setShowPublishModal(true)}
        onPreview={() => toast.error('Preview coming soon')}
        isSaving={isSaving}
        isPublishing={isPublishing}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Title Input */}
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Title"
          className="w-full text-5xl font-bold outline-none mb-8 placeholder-gray-300"
        />

        {/* Cover Image */}
        <div className="mb-8">
          <ImageUpload
            value={formData.coverImage}
            onChange={(url) => setFormData({ ...formData, coverImage: url })}
            label="Cover Image"
          />
        </div>

        {/* Rich Text Editor */}
        <RichTextEditor
          value={formData.content}
          onChange={(content) => setFormData({ ...formData, content })}
          placeholder="Tell your story..."
        />
      </div>

      {/* Publish Modal */}
      <Modal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        title="Update your story"
        size="md"
      >
        <div className="space-y-6">
          <Input
            label="Excerpt (optional)"
            placeholder="Brief description of your story..."
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          />

          <TagInput
            value={formData.tags}
            onChange={(tags) => setFormData({ ...formData, tags })}
          />

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowPublishModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handlePublish}
              isLoading={isPublishing}
            >
              Update now
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
