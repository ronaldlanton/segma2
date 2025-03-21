import React, { useRef } from 'react';
import { BoxState } from '../types';
import { saveLayout, loadLayout, downloadLayout, LayoutFile } from '../utils/layoutManager';

interface FloatingMenuProps {
  boxes: BoxState[];
  onLoadLayout: (boxes: BoxState[]) => void;
}

const SaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const LoadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const FloatingMenu: React.FC<FloatingMenuProps> = ({ boxes, onLoadLayout }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const layout = saveLayout(boxes);
    downloadLayout(layout);
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const layout = JSON.parse(e.target?.result as string) as LayoutFile;
          const newBoxes = loadLayout(layout);
          onLoadLayout(newBoxes);
        } catch (error) {
          console.error('Error loading layout:', error);
          alert('Invalid layout file');
        }
      };
      reader.readAsText(file);
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="floating-menu">
      <button className="menu-button" onClick={handleSave} title="Save Layout">
        <SaveIcon />
      </button>
      <button className="menu-button" onClick={() => fileInputRef.current?.click()} title="Load Layout">
        <LoadIcon />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleLoad}
      />
    </div>
  );
};