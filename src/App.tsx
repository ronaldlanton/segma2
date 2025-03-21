import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import './FloatingMenu.css';
import { FloatingMenu } from './components/FloatingMenu';
import { BoxState, Direction } from './types';
import { saveLayout, loadLayout } from './utils/layoutManager';

// ... existing code ...

function App() {
  const [boxes, setBoxes] = useState<BoxState[]>([
    {
      id: '1',
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      backgroundColor: '#ffffff',
      backgroundImage: null,
      children: null,
      splitDirection: null
    }
  ]);

  // ... existing code ...

  const handleSaveLayout = () => {
    const layoutFile = saveLayout(boxes);
    const blob = new Blob([JSON.stringify(layoutFile)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadLayout = async (file: File) => {
    try {
      const text = await file.text();
      const layoutFile = JSON.parse(text);
      const newBoxes = loadLayout(layoutFile);
      setBoxes(newBoxes);
    } catch (error) {
      console.error('Error loading layout:', error);
      alert('Error loading layout file. Please make sure it is a valid layout file.');
    }
  };

  return (
    <div className="app">
      {renderBox(boxes[0], 0)}
      <FloatingMenu onSave={handleSaveLayout} onLoad={handleLoadLayout} />
    </div>
  );
}

export default App;