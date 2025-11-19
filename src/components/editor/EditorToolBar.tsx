'use client';

import { Eye, Save, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EditorToolbarProps {
  onSaveDraft: () => void;
  onPublish: () => void;
  onPreview: () => void;
  isSaving?: boolean;
  isPublishing?: boolean;
}

export function EditorToolbar({
  onSaveDraft,
  onPublish,
  onPreview,
  isSaving,
  isPublishing,
}: EditorToolbarProps) {
  return (
    <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPreview}
            >
              <Eye size={18} className="mr-2" />
              Preview
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveDraft}
              isLoading={isSaving}
            >
              <Save size={18} className="mr-2" />
              Save Draft
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onPublish}
              isLoading={isPublishing}
            >
              <Send size={18} className="mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
