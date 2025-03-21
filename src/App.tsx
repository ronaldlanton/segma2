import React, { useState, useCallback, useRef, useEffect } from 'react'
import './App.css'

// ... [Previous code remains the same until the renderBox function] ...

  const renderBox = useCallback((box: BoxState) => {
    if (box.type === 'single') {
      return (
        <SplitBox
          onSplitVertical={() => handleSplit(box.id, 'vertical')}
          onSplitHorizontal={() => handleSplit(box.id, 'horizontal')}
          onSplitGrid={(rows, columns) => handleSplitGrid(box.id, rows, columns)}
          onDelete={boxes.length > 1 ? () => handleDelete(box.id) : undefined}
          onColorChange={(color) => handleColorChange(box.id, color)}
          onImageChange={(image) => handleImageChange(box.id, image)}
          backgroundColor={box.backgroundColor}
          backgroundImage={box.backgroundImage}
          padding={box.padding}
          onPaddingChange={(position, value) => handlePaddingChange(box.id, position, value)}
        />
      );
    }

    if (box.type === 'grid' && box.children && box.rows && box.columns) {
      return (
        <div
          className="grid-container"
          style={{
            gridTemplateColumns: `repeat(${box.columns}, 1fr)`,
            gridTemplateRows: `repeat(${box.rows}, 1fr)`
          }}
        >
          {box.children.map((child) => (
            <div key={child.id} className="grid-item">
              {renderBox(child)}
            </div>
          ))}
        </div>
      );
    }

    if (!box.children || box.children.length !== 2) {
      return null;
    }

    const containerClass = box.type === 'vertical' ? 'split-container-vertical' : 'split-container-horizontal';
    const firstChildStyle = { flex: box.ratio || 0.5 };
    const secondChildStyle = { flex: 1 - (box.ratio || 0.5) };

    return (
      <div className={containerClass}>
        <div className="split-section" style={firstChildStyle}>
          {renderBox(box.children[0])}
        </div>
        <Divider
          isVertical={box.type === 'vertical'}
          onResize={(ratio) => handleResize(box.children[0].id, ratio)}
          initialRatio={box.ratio || 0.5}
        />
        <div className="split-section" style={secondChildStyle}>
          {renderBox(box.children[1])}
        </div>
      </div>
    );
  }, [boxes.length, handleColorChange, handleDelete, handleImageChange, handlePaddingChange, handleResize, handleSplit, handleSplitGrid]);

  return (
    <div className="container">
      {boxes.map(box => renderBox(box))}
    </div>
  );
};

export default App;