import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import './FloatingMenu.css';
import { FloatingMenu } from './components/FloatingMenu';

interface BoxState {
  id: string;
  type: 'single' | 'grid';
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  backgroundColor?: string;
  backgroundImage?: string;
  children?: BoxState[];
  splitDirection?: 'horizontal' | 'vertical';
  splitRatio?: number;
}

interface GridDialogProps {
  onClose: () => void;
  onCreateGrid: (rows: number, cols: number) => void;
}

const GridDialog: React.FC<GridDialogProps> = ({ onClose, onCreateGrid }) => {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);

  return (
    <div className="grid-dialog">
      <h3>Create Grid</h3>
      <div>
        <label>
          Rows:
          <input
            type="number"
            min="1"
            value={rows}
            onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </label>
      </div>
      <div>
        <label>
          Columns:
          <input
            type="number"
            min="1"
            value={cols}
            onChange={(e) => setCols(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </label>
      </div>
      <div className="grid-dialog-buttons">
        <button onClick={() => onCreateGrid(rows, cols)}>Create</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

interface SplitBoxProps {
  box: BoxState;
  onUpdate: (box: BoxState) => void;
  onSplit: () => void;
}

const SplitBox: React.FC<SplitBoxProps> = ({ box, onUpdate, onSplit }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePaddingChange = (side: keyof BoxState['padding'], value: number) => {
    onUpdate({
      ...box,
      padding: {
        ...box.padding,
        [side]: value,
      },
    });
  };

  const handleColorChange = (color: string) => {
    onUpdate({
      ...box,
      backgroundColor: color,
    });
    setShowColorPicker(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdate({
          ...box,
          backgroundImage: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="content" style={{ padding: `${box.padding.top}px ${box.padding.right}px ${box.padding.bottom}px ${box.padding.left}px` }}>
      <div
        className="inner-content"
        style={{
          backgroundColor: box.backgroundColor,
          backgroundImage: box.backgroundImage ? `url(${box.backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="padding-handles">
          {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
            <input
              key={side}
              type="number"
              className={`padding-handle padding-handle-${side}`}
              value={box.padding[side]}
              onChange={(e) => handlePaddingChange(side, parseInt(e.target.value) || 0)}
            />
          ))}
        </div>
        <div className="controls">
          <button onClick={onSplit}>Split</button>
          <button onClick={() => setShowColorPicker(!showColorPicker)}>Color</button>
          <button onClick={() => fileInputRef.current?.click()}>Image</button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        {showColorPicker && (
          <div className="color-picker">
            <div className="color-options">
              {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#000000'].map(
                (color) => (
                  <div
                    key={color}
                    className="color-option"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                  />
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface DividerProps {
  direction: 'horizontal' | 'vertical';
  onResize: (ratio: number) => void;
}

const Divider: React.FC<DividerProps> = ({ direction, onResize }) => {
  const dividerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [startRatio, setStartRatio] = useState(0.5);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos(direction === 'horizontal' ? e.clientX : e.clientY);
    setStartRatio(0.5); // You might want to pass the current ratio as a prop
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dividerRef.current) {
        const container = dividerRef.current.parentElement;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
          const totalSize = direction === 'horizontal' ? containerRect.width : containerRect.height;
          const delta = currentPos - startPos;
          const newRatio = Math.max(0.1, Math.min(0.9, startRatio + delta / totalSize));
          onResize(newRatio);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, direction, onResize, startPos, startRatio]);

  return (
    <div
      ref={dividerRef}
      className={`divider ${direction} ${isDragging ? 'dragging' : ''}`}
      onMouseDown={handleMouseDown}
    />
  );
};

const App: React.FC = () => {
  const [boxes, setBoxes] = useState<BoxState[]>([
    {
      id: '1',
      type: 'single',
      padding: { top: 10, right: 10, bottom: 10, left: 10 },
    },
  ]);

  const [showGridDialog, setShowGridDialog] = useState(false);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);

  const handleCreateGrid = (rows: number, cols: number) => {
    if (selectedBoxId) {
      const newBoxes = [...boxes];
      const selectedBox = findBoxById(newBoxes, selectedBoxId);
      if (selectedBox) {
        selectedBox.type = 'grid';
        selectedBox.children = Array.from({ length: rows * cols }, (_, i) => ({
          id: `${selectedBoxId}-${i}`,
          type: 'single',
          padding: { top: 10, right: 10, bottom: 10, left: 10 },
        }));
        setBoxes(newBoxes);
      }
    }
    setShowGridDialog(false);
    setSelectedBoxId(null);
  };

  const findBoxById = (boxes: BoxState[], id: string): BoxState | null => {
    for (const box of boxes) {
      if (box.id === id) return box;
      if (box.children) {
        const found = findBoxById(box.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleSplit = (boxId: string) => {
    const newBoxes = [...boxes];
    const box = findBoxById(newBoxes, boxId);
    if (box) {
      const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      box.type = 'single';
      box.splitDirection = direction;
      box.splitRatio = 0.5;
      box.children = [
        {
          id: `${boxId}-1`,
          type: 'single',
          padding: { ...box.padding },
          backgroundColor: box.backgroundColor,
          backgroundImage: box.backgroundImage,
        },
        {
          id: `${boxId}-2`,
          type: 'single',
          padding: { ...box.padding },
        },
      ];
      setBoxes(newBoxes);
    }
  };

  const handleBoxUpdate = (boxId: string, updatedBox: BoxState) => {
    const newBoxes = [...boxes];
    const box = findBoxById(newBoxes, boxId);
    if (box) {
      Object.assign(box, updatedBox);
      setBoxes(newBoxes);
    }
  };

  const handleLoadLayout = (newBoxes: BoxState[]) => {
    setBoxes(newBoxes);
  };

  const renderBox = (box: BoxState): React.ReactNode => {
    if (box.type === 'grid' && box.children) {
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.sqrt(box.children.length)}, 1fr)`,
            gap: '10px',
            padding: '10px',
            height: '100%',
          }}
        >
          {box.children.map((child) => (
            <div key={child.id}>{renderBox(child)}</div>
          ))}
        </div>
      );
    }

    if (box.children && box.splitDirection) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: box.splitDirection === 'horizontal' ? 'row' : 'column',
            height: '100%',
          }}
        >
          <div style={{ flex: box.splitRatio }}>
            {renderBox(box.children[0])}
          </div>
          <Divider
            direction={box.splitDirection}
            onResize={(ratio) => {
              const newBoxes = [...boxes];
              const updatedBox = findBoxById(newBoxes, box.id);
              if (updatedBox) {
                updatedBox.splitRatio = ratio;
                setBoxes(newBoxes);
              }
            }}
          />
          <div style={{ flex: 1 - (box.splitRatio || 0.5) }}>
            {renderBox(box.children[1])}
          </div>
        </div>
      );
    }

    return (
      <SplitBox
        box={box}
        onUpdate={(updatedBox) => handleBoxUpdate(box.id, updatedBox)}
        onSplit={() => handleSplit(box.id)}
      />
    );
  };

  return (
    <div className="container">
      {renderBox(boxes[0])}
      {showGridDialog && (
        <GridDialog onClose={() => setShowGridDialog(false)} onCreateGrid={handleCreateGrid} />
      )}
      <FloatingMenu boxes={boxes} onLoadLayout={handleLoadLayout} />
    </div>
  );
};

export default App;