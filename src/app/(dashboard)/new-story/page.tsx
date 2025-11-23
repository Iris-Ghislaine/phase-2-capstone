'use client';

import  { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { RichTextEditor } from '../../../components/editor/RichTextEditor';
import { ImageUpload } from '../../../components/editor/ImageUpload';
import { EditorToolbar } from '../../../components/editor/EditorToolBar';
import { TagInput } from '../../../components/editor/TagInput';
import { Input } from '../../../components/ui/Input';
import { useCreatePost } from '../../../hooks/UsePosts';
import { useToast } from '../../../context/ToastContext';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

export default function NewStoryPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const toast = useToast();
  const { mutate: createPost } = useCreatePost();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: [] as string[],
  });

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);



useEffect(() => {
  if (!session) {
    router.push('/login');
  }
}, [session]);

if (!session) {
  return null;
}


  const handleSaveDraft = async () => {
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    setIsSaving(true);
    createPost(
      { ...formData, published: false },
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
      // Auto-generate excerpt
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formData.content;
      const text = tempDiv.textContent || tempDiv.innerText || '';
      formData.excerpt = text.substring(0, 200) + '...';
    }

    setIsPublishing(true);
    createPost(
      { ...formData, published: true },
      {
        onSuccess: (data) => {
          toast.success('Post published!');
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
        title="Publish your story"
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
              Publish now
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}


// 'use client';

// import  { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import { RichTextEditor } from '../../../components/editor/RichTextEditor';
// import { ImageUpload } from '../../../components/editor/ImageUpload';
// import { EditorToolbar } from '../../../components/editor/EditorToolBar';
// import { TagInput } from '../../../components/editor/TagInput';
// import { Input } from '../../../components/ui/Input';
// import { useCreatePost } from '../../../hooks/UsePosts';
// import { useToast } from '../../../context/ToastContext';
// import { Modal } from '../../../components/ui/Modal';
// import { Button } from '../../../components/ui/Button';

// export default function NewStoryPage() {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const toast = useToast();
//   const { mutate: createPost } = useCreatePost();

//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     excerpt: '',
//     coverImage: '',
//     tags: [] as string[],
//   });

//   const [showPublishModal, setShowPublishModal] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isPublishing, setIsPublishing] = useState(false);



// useEffect(() => {
//   if (!session) {
//     router.push('/login');
//   }
// }, [session]);

// if (!session) {
//   return null;
// }


//   const handleSaveDraft = async () => {
//     if (!formData.title || !formData.content) {
//       toast.error('Title and content are required');
//       return;
//     }

//     setIsSaving(true);
//     createPost(
//       { ...formData, published: false },
//       {
//         onSuccess: () => {
//           toast.success('Draft saved!');
//           router.push('/drafts');
//         },
//         onSettled: () => setIsSaving(false),
//       }
//     );
//   };

//   const handlePublish = async () => {
//     if (!formData.title || !formData.content) {
//       toast.error('Title and content are required');
//       return;
//     }

//     if (!formData.excerpt) {
//       // Auto-generate excerpt
//       const tempDiv = document.createElement('div');
//       tempDiv.innerHTML = formData.content;
//       const text = tempDiv.textContent || tempDiv.innerText || '';
//       formData.excerpt = text.substring(0, 200) + '...';
//     }

//     setIsPublishing(true);
//     createPost(
//       { ...formData, published: true },
//       {
//         onSuccess: (data) => {
//           toast.success('Post published!');
//           router.push(`/post/${data.slug}`);
//         },
//         onSettled: () => {
//           setIsPublishing(false);
//           setShowPublishModal(false);
//         },
//       }
//     );
//   };

//   return (
//     <>
//       <EditorToolbar
//         onSaveDraft={handleSaveDraft}
//         onPublish={() => setShowPublishModal(true)}
//         onPreview={() => toast.error('Preview coming soon')}
//         isSaving={isSaving}
//         isPublishing={isPublishing}
//       />

//       <div className="max-w-4xl mx-auto px-4 py-12">
//         {/* Title Input */}
//         <input
//           type="text"
//           value={formData.title}
//           onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//           placeholder="Title"
//           className="w-full text-5xl font-bold outline-none mb-8 placeholder-gray-300"
//         />

//         {/* Cover Image */}
//         <div className="mb-8">
//           <ImageUpload
//             value={formData.coverImage}
//             onChange={(url) => setFormData({ ...formData, coverImage: url })}
//             label="Cover Image"
//           />
//         </div>

//         {/* Rich Text Editor */}
//         <RichTextEditor
//           value={formData.content}
//           onChange={(content) => setFormData({ ...formData, content })}
//           placeholder="Tell your story..."
//         />
//       </div>

//       {/* Publish Modal */}
//       <Modal
//         isOpen={showPublishModal}
//         onClose={() => setShowPublishModal(false)}
//         title="Publish your story"
//         size="md"
//       >
//         <div className="space-y-6">
//           <Input
//             label="Excerpt (optional)"
//             placeholder="Brief description of your story..."
//             value={formData.excerpt}
//             onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
//           />

//           <TagInput
//             value={formData.tags}
//             onChange={(tags) => setFormData({ ...formData, tags })}
//           />

//           <div className="flex gap-3 justify-end pt-4 border-t">
//             <Button
//               variant="outline"
//               onClick={() => setShowPublishModal(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="primary"
//               onClick={handlePublish}
//               isLoading={isPublishing}
//             >
//               Publish now
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </>
//   );
// }