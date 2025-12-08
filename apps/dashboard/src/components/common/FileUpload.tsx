'use client';

import React, { useRef } from 'react';

interface FileUploadProps {
  onUpload: (file: File) => void;
  accept?: string;
}

export function FileUpload({ onUpload, accept }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-sabay-primary rounded-lg hover:bg-sabay-primary/90 transition"
      >
        Загрузить файл
      </button>
    </div>
  );
}
