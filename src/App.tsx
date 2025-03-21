import React, { useState, useCallback, MouseEvent, useRef, useEffect } from 'react'
import './App.css'

interface GridDialogProps {
  onConfirm: (rows: number, columns: number) => void;
  onCancel: () => void;
}

const GridDialog: React.FC<GridDialogProps> = ({ onConfirm, onCancel }) => {
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(2);

  return (
    <div className="grid-dialog-overlay">
      <div className="grid-dialog">
        <h3>Create Grid</h3>
        <div className="grid-input-group">
          <label>
            Rows:
            <input
              type="number"
              min="1"
              max="5"
              value={rows}
              onChange={(e) => setRows(Math.min(5, Math.max(1, parseInt(e.target.value) || 1)))}
            />
          </label>
          <label>
            Columns:
            <input
              type="number"
              min="1"
              max="5"
              value={columns}
              onChange={(e) => setColumns(Math.min(5, Math.max(1, parseInt(e.target.value) || 1)))}
            />
          </label>
        </div>
        <div className="grid-preview">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid-preview-row">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="grid-preview-cell" />
              ))}
            </div>
          ))}
        </div>
        <div className="grid-dialog-buttons">
          <button onClick={() => onConfirm(rows, columns)}>Create Grid</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

interface SplitBoxProps {
  onSplitVertical: () => void;
  onSplitHorizontal: () => void;
  onSplitGrid?: (rows: number, columns: number) => void;
  onDelete?: () => void;
  onColorChange?: (color: string | null) => void;
  onImageChange?: (image: string | null) => void;
  onPaddingChange?: (position: 'top' | 'right' | 'bottom' | 'left', value: number) => void;
  showMerge?: boolean;
  backgroundColor?: string | null;
  backgroundImage?: string | null;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

const VerticalSplitIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12h18M6 4v16h12V4z" />
  </svg>
);

const HorizontalSplitIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v18M4 6h16v12H4z" />
  </svg>
);

const GridSplitIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16v16H4zM8 4v16M16 4v16M4 8h16M4 16h16" />
  </svg>
);

const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 6l12 12M6 18L18 6" />
  </svg>
);

const ColorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3L17.196 10.098C18.3697 11.6879 19 13.6275 19 15.618C19 18.5697 16.5697 21 13.618 21H10.382C7.43034 21 5 18.5697 5 15.618C5 13.6275 5.63031 11.6879 6.80397 10.098L12 3Z" />
  </svg>
);

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

interface TooltipProps {
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, 2000);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  return (
    <div 
      className={`tooltip ${isVisible ? 'visible' : ''}`}
    >
      {text}
    </div>
  );
};

const SplitButton: React.FC<{
  onClick: () => void;
  className?: string;
  tooltip: string;
  children: React.ReactNode;
}> = ({ onClick, className = '', tooltip, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<number>();

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setShowTooltip(true);
    }, 500);
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setShowTooltip(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <button
      className={`split-button ${className}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div className={`tooltip ${showTooltip ? 'visible' : ''}`}>
        {tooltip}
      </div>
    </button>
  );
};

const SplitBox: React.FC<SplitBoxProps> = ({ 
  onSplitVertical, 
  onSplitHorizontal,
  onSplitGrid, 
  onDelete,
  onColorChange,
  onImageChange,
  showMerge,
  backgroundColor,
  backgroundImage,
  padding = { top: 0, right: 0, bottom: 0, left: 0 },
  onPaddingChange
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showGridDialog, setShowGridDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        onImageChange?.(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="content" style={{ 
      padding: `${padding.top}% ${padding.right}% ${padding.bottom}% ${padding.left}%`
    }}>
      <PaddingHandle position="top" value={padding.top} onChange={onPaddingChange || (() => {})} />
      <PaddingHandle position="right" value={padding.right} onChange={onPaddingChange || (() => {})} />
      <PaddingHandle position="bottom" value={padding.bottom} onChange={onPaddingChange || (() => {})} />
      <PaddingHandle position="left" value={padding.left} onChange={onPaddingChange || (() => {})} />
      <div className="inner-content" style={{ 
        backgroundColor: backgroundColor || undefined,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        width: '100%',
        height: '100%'
      }}>
        <div className="button-group">
          <SplitButton
            onClick={onSplitVertical}
            tooltip="Split Vertically"
          >
            <VerticalSplitIcon />
          </SplitButton>
          <SplitButton
            onClick={onSplitHorizontal}
            tooltip="Split Horizontally"
          >
            <HorizontalSplitIcon />
          </SplitButton>
          {onSplitGrid && (
            <SplitButton
              onClick={() => setShowGridDialog(true)}
              className="grid"
              tooltip="Create Grid"
            >
              <GridSplitIcon />
            </SplitButton>
          )}
          <SplitButton
            onClick={() => setShowColorPicker(!showColorPicker)}
            className={`color ${backgroundColor ? 'remove' : ''}`}
            tooltip={backgroundColor ? 'Remove Color' : 'Change Color'}
          >
            <ColorIcon />
          </SplitButton>
          <SplitButton
            onClick={() => {
              if (backgroundImage) {
                onImageChange?.(null);
              } else {
                fileInputRef.current?.click();
              }
            }}
            className={`image ${backgroundImage ? 'remove' : ''}`}
            tooltip={backgroundImage ? 'Remove Image' : 'Add Image'}
          >
            <ImageIcon />
          </SplitButton>
          {onDelete && (
            <SplitButton
              onClick={onDelete}
              className="delete"
              tooltip="Delete Section"
            >
              <DeleteIcon />
            </SplitButton>
          )}
        </div>
        {showColorPicker && (
          <div className="color-picker">
            {['#ff9999', '#99ff99', '#9999ff', '#ffff99', '#ff99ff', '#99ffff'].map((color) => (
              <div
                key={color}
                className="color-option"
                style={{ backgroundColor: color }}
                onClick={() => {
                  onColorChange?.(color);
                  setShowColorPicker(false);
                }}
              />
            ))}
            <div
              className="color-option cancel"
              onClick={() => {
                onColorChange?.(null);
                setShowColorPicker(false);
              }}
            />
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>
      {showGridDialog && onSplitGrid && (
        <GridDialog
          onConfirm={(rows, columns) => {
            onSplitGrid(rows, columns);
            setShowGridDialog(false);
          }}
          onCancel={() => setShowGridDialog(false)}
        />
      )}
    </div>
  );
};

interface BoxState {
  id: string;
  type: 'single' | 'vertical' | 'horizontal' | 'grid';
  children?: BoxState[];
  ratio?: number;
  backgroundColor?: string | null;
  backgroundImage?: string | null;
  rows?: number;
  columns?: number;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

interface DividerProps {
  isVertical: boolean;
  onResize: (ratio: number) => void;
  initialRatio: number;
}

const Divider: React.FC<DividerProps> = ({ isVertical, onResize, initialRatio }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const container = (e.target as HTMLElement).closest('.split-container-vertical, .split-container-horizontal');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const startPosition = isVertical ? e.clientY : e.clientX;
    const containerSize = isVertical ? containerRect.height : containerRect.width;
    const padding = 16; // Account for container padding

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const currentPosition = isVertical ? e.clientY : e.clientX;
      const delta = currentPosition - startPosition;
      const totalSize = containerSize - 2 * padding;
      const newRatio = Math.min(0.9, Math.max(0.1, initialRatio + delta / totalSize));

      onResize(newRatio);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={`divider ${isVertical ? 'vertical' : 'horizontal'} ${isDragging ? 'dragging' : ''}`}
      onMouseDown={handleMouseDown as any}
    />
  );
};

interface PaddingHandleProps {
  position: 'top' | 'right' | 'bottom' | 'left';
  value: number;
  onChange: (position: 'top' | 'right' | 'bottom' | 'left', value: number) => void;
}

const PaddingHandle: React.FC<PaddingHandleProps> = ({ position, value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const sensitivity = 0.33; // Reduce movement sensitivity

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startValue = value;
    const isShiftPressed = e.shiftKey;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const isVertical = position === 'top' || position === 'bottom';
      const delta = isVertical ? deltaY : deltaX;
      const direction = position === 'bottom' || position === 'right' ? 1 : -1;

      // Calculate the percentage delta with reduced sensitivity
      const percentDelta = (delta * direction * sensitivity) / 5;
      
      // Calculate new value and clamp between 0 and 50
      const newValue = Math.min(50, Math.max(0, startValue + percentDelta));

      // Round to two decimal places for smoother updates
      const roundedValue = Math.round(newValue * 100) / 100;

      if (isShiftPressed) {
        // Update all sides if shift is pressed
        onChange('top', roundedValue);
        onChange('right', roundedValue);
        onChange('bottom', roundedValue);
        onChange('left', roundedValue);
      } else {
        // Update only the current side
        onChange(position, roundedValue);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={`padding-handle ${position} ${isDragging ? 'dragging' : ''}`}
      onMouseDown={handleMouseDown as any}
    />
  );
};

const App: React.FC = () => {
  const [boxes, setBoxes] = useState<BoxState[]>([
    {
      id: '1',
      type: 'single',
      padding: { top: 0, right: 0, bottom: 0, left: 0 }
    }
  ]);

  const handleSplit = (id: string, splitType: 'vertical' | 'horizontal') => {
    setBoxes(prevBoxes => {
      const updateNode = (node: BoxState): BoxState => {
        if (node.id === id) {
          return {
            id: node.id,
            type: splitType,
            children: [
              { id: `${node.id}-1`, type: 'single', padding: { top: 0, right: 0, bottom: 0, left: 0 } },
              { id: `${node.id}-2`, type: 'single', padding: { top: 0, right: 0, bottom: 0, left: 0 } }
            ],
            ratio: 0.5
          };
        }

        if (node.children) {
          return {
            ...node,
            children: node.children.map(child => updateNode(child))
          };
        }

        return node;
      };

      return prevBoxes.map(box => updateNode(box));
    });
  };

  const handleSplitGrid = (id: string, rows: number, columns: number) => {
    setBoxes(prevBoxes => {
      const updateNode = (node: BoxState): BoxState => {
        if (node.id === id) {
          const children: BoxState[] = [];
          for (let i = 0; i < rows * columns; i++) {
            children.push({
              id: `${node.id}-${i + 1}`,
              type: 'single',
              padding: { top: 0, right: 0, bottom: 0, left: 0 }
            });
          }
          return {
            id: node.id,
            type: 'grid',
            children,
            rows,
            columns
          };
        }

        if (node.children) {
          return {
            ...node,
            children: node.children.map(child => updateNode(child))
          };
        }

        return node;
      };

      return prevBoxes.map(box => updateNode(box));
    });
  };

  const handleResize = (id: string, ratio: number) => {
    setBoxes(prevBoxes => {
      const updateNode = (node: BoxState): BoxState => {
        if (node.children?.some(child => child.id === id)) {
          return {
            ...node,
            ratio
          };
        }

        if (node.children) {
          return {
            ...node,
            children: node.children.map(child => updateNode(child))
          };
        }

        return node;
      };

      return prevBoxes.map(box => updateNode(box));
    });
  };

  const handleMerge = (id: string) => {
    setBoxes(prevBoxes => {
      const updateNode = (node: BoxState): BoxState => {
        if (node.id === id) {
          return {
            id: node.id,
            type: 'single',
            padding: { top: 0, right: 0, bottom: 0, left: 0 }
          };
        }

        if (node.children) {
          return {
            ...node,
            children: node.children.map(child => updateNode(child))
          };
        }

        return node;
      };

      return prevBoxes.map(box => updateNode(box));
    });
  };

  const handleDelete = (id: string) => {
    setBoxes(prevBoxes => {
      const updateNode = (node: BoxState): BoxState | undefined => {
        if (node.children) {
          const newChildren = node.children
            .map(child => updateNode(child))
            .filter((child): child is BoxState => child !== undefined);

          if (newChildren.length === 0) {
            return undefined;
          }

          if (newChildren.length === 1 && node.type !== 'grid') {
            return newChildren[0];
          }

          return {
            ...node,
            children: newChildren
          };
        }

        if (node.id === id) {
          return undefined;
        }

        return node;
      };

      const updatedBoxes = prevBoxes
        .map(box => updateNode(box))
        .filter((box): box is BoxState => box !== undefined);

      return updatedBoxes.length > 0 ? updatedBoxes : [{
        id: '1',
        type: 'single',
        padding: { top: 0, right: 0, bottom: 0, left: 0 }
      }];
    });
  };

  const handleColorChange = (id: string, color: string | null) => {
    setBoxes(prevBoxes => {
      const updateNode = (node: BoxState): BoxState => {
        if (node.id === id) {
          return {
            ...node,
            backgroundColor: color
          };
        }

        if (node.children) {
          return {
            ...node,
            children: node.children.map(child => updateNode(child))
          };
        }

        return node;
      };

      return prevBoxes.map(box => updateNode(box));
    });
  };

  const handleImageChange = (id: string, image: string | null) => {
    setBoxes(prevBoxes => {
      const updateNode = (node: BoxState): BoxState => {
        if (node.id === id) {
          return {
            ...node,
            backgroundImage: image
          };
        }

        if (node.children) {
          return {
            ...node,
            children: node.children.map(child => updateNode(child))
          };
        }

        return node;
      };

      return prevBoxes.map(box => updateNode(box));
    });
  };

  const handlePaddingChange = (id: string, position: 'top' | 'right' | 'bottom' | 'left', value: number) => {
    setBoxes(prevBoxes => {
      const updateNode = (node: BoxState): BoxState => {
        if (node.id === id) {
          return {
            ...node,
            padding: {
              ...node.padding,
              [position]: value
            }
          };
        }

        if (node.children) {
          return {
            ...node,
            children: node.children.map(child => updateNode(child))
          };
        }

        return node;
      };

      return prevBoxes.map(box => updateNode(box));
    });
  };

  const renderBox = (box: BoxState) => {
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

    if (box.type === 'grid' && box.children) {
      return (
        <div
          className="grid-container"
          style={{
            gridTemplateColumns: `repeat(${box.columns}, 1fr)`,
            gridTemplateRows: `repeat(${box.rows}, 1fr)`
          }}
        >
          {box.children.map((child, index) => (
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
  };

  return (
    <div className="container">
      {boxes.map(box => renderBox(box))}
    </div>
  );
};

export default App;