'use client';

import React, { useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
  loading: () => <div className="h-[500px] border border-gray-300 rounded-lg flex items-center justify-center">Loading editor...</div>
});

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || 'Tell your story...',
      minHeight: 500,
      toolbar: true,
      spellcheck: true,
      language: 'en',
      toolbarButtonSize: 'large' as const,
      toolbarAdaptive: false,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      buttons: [
        'bold',
        'italic',
        'underline',
        '|',
        'ul',
        'ol',
        '|',
        'font',
        'fontsize',
        'brush',
        '|',
        'align',
        'undo',
        'redo',
        '|',
        'paragraph',
        'link',
        'image',
        'video',
        'table',
        '|',
        'hr',
        'quote',
        'source',
      ],
      uploader: {
        insertImageAsBase64URI: false,
      },
      removeButtons: ['brush', 'file'],
      editorCssClass: 'custom-editor',
      style: {
        font: '18px Georgia, serif',
        color: '#1a1a1a',
      },
    }),
    [placeholder]
  );

  return (
    <div className="rich-text-editor">
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        onBlur={(newContent) => onChange(newContent)}
        onChange={(newContent) => {}}
      />
    </div>
  );
}