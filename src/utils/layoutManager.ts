import { BoxState } from '../types';

export interface LayoutImage {
  id: string;
  data: string;
}

export interface LayoutFile {
  version: string;
  boxes: BoxState[];
  images: LayoutImage[];
}

export const saveLayout = (boxes: BoxState[]): LayoutFile => {
  const images: LayoutImage[] = [];
  let imageId = 1;

  const processBox = (box: BoxState): BoxState => {
    const newBox = { ...box };
    
    if (box.backgroundImage) {
      const imageData = box.backgroundImage;
      const id = `img_${imageId++}`;
      images.push({ id, data: imageData });
      newBox.backgroundImage = id;
    }

    if (box.children) {
      newBox.children = box.children.map(processBox);
    }

    return newBox;
  };

  const processedBoxes = boxes.map(processBox);

  return {
    version: '1.0',
    boxes: processedBoxes,
    images,
  };
};

export const loadLayout = (layout: LayoutFile): BoxState[] => {
  const imageMap = new Map(layout.images.map(img => [img.id, img.data]));

  const processBox = (box: BoxState): BoxState => {
    const newBox = { ...box };

    if (box.backgroundImage && imageMap.has(box.backgroundImage)) {
      newBox.backgroundImage = imageMap.get(box.backgroundImage);
    }

    if (box.children) {
      newBox.children = box.children.map(processBox);
    }

    return newBox;
  };

  return layout.boxes.map(processBox);
};

export const downloadLayout = (layout: LayoutFile) => {
  const blob = new Blob([JSON.stringify(layout, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'layout.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};