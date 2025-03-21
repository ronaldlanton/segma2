// ... [Previous imports and interfaces remain the same] ...

const handleSplit = useCallback((id: string, splitType: 'vertical' | 'horizontal') => {
  setBoxes(prevBoxes => {
    const updateNode = (node: BoxState): BoxState => {
      if (node.id === id) {
        // Preserve the current node's properties
        const currentProperties = {
          backgroundColor: node.backgroundColor,
          backgroundImage: node.backgroundImage,
          padding: node.padding
        };

        // Create new children with default properties
        return {
          ...node,
          ...currentProperties, // Keep the current node's properties
          type: splitType,
          children: [
            {
              id: `${node.id}-1`,
              type: 'single',
              padding: { top: 0, right: 0, bottom: 0, left: 0 }
            },
            {
              id: `${node.id}-2`,
              type: 'single',
              padding: { top: 0, right: 0, bottom: 0, left: 0 }
            }
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
}, []);

const handleSplitGrid = useCallback((id: string, rows: number, columns: number) => {
  setBoxes(prevBoxes => {
    const updateNode = (node: BoxState): BoxState => {
      if (node.id === id) {
        // Preserve the current node's properties
        const currentProperties = {
          backgroundColor: node.backgroundColor,
          backgroundImage: node.backgroundImage,
          padding: node.padding
        };

        // Create grid children with default properties
        const children: BoxState[] = [];
        for (let i = 0; i < rows * columns; i++) {
          children.push({
            id: `${node.id}-${i + 1}`,
            type: 'single',
            padding: { top: 0, right: 0, bottom: 0, left: 0 }
          });
        }

        return {
          ...node,
          ...currentProperties, // Keep the current node's properties
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
}, []);

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
          backgroundSize: 'cover'
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
        backgroundSize: 'cover'
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