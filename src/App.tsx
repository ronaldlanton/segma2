// ... [Previous imports and interfaces remain the same until SplitBox component] ...

const SplitBox: React.FC<SplitBoxProps> = ({
  onSplitVertical,
  onSplitHorizontal,
  onSplitGrid,
  onDelete,
  onColorChange,
  onImageChange,
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
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
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

// ... [Previous code remains the same until renderBox function] ...

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
      <div className="content" style={{
        padding: `${box.padding.top}% ${box.padding.right}% ${box.padding.bottom}% ${box.padding.left}%`
      }}>
        <div className="inner-content grid-container" style={{
          gridTemplateColumns: `repeat(${box.columns}, 1fr)`,
          gridTemplateRows: `repeat(${box.rows}, 1fr)`,
          backgroundColor: box.backgroundColor || undefined,
          backgroundImage: box.backgroundImage ? `url(${box.backgroundImage})` : undefined,
          backgroundSize: 'cover',
          width: '100%',
          height: '100%'
        }}>
          {box.children.map((child) => (
            <div key={child.id} className="grid-item">
              {renderBox(child)}
            </div>
          ))}
        </div>
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
    <div className="content" style={{
      padding: `${box.padding.top}% ${box.padding.right}% ${box.padding.bottom}% ${box.padding.left}%`
    }}>
      <div className={`inner-content ${containerClass}`} style={{
        backgroundColor: box.backgroundColor || undefined,
        backgroundImage: box.backgroundImage ? `url(${box.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        width: '100%',
        height: '100%'
      }}>
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
    </div>
  );
}, [boxes.length, handleColorChange, handleDelete, handleImageChange, handlePaddingChange, handleResize, handleSplit, handleSplitGrid]);

// ... [Rest of the code remains the same] ...