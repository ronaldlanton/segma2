import { BoxState } from '../types';

export interface LayoutImage {
  id: string;
  data: string;
}

export interface LayoutFile {
  version: '1.0';
  layout: BoxState[];
  images: LayoutImage[];
}

export const saveLayout = (boxes: BoxState[]): LayoutFile => {
  const images: LayoutImage[] = [];
  const imageMap = new Map<string, string>();

  const processNode = (node: BoxState): BoxState => {
    const processedNode = { ...node };

    if (node.backgroundImage) {
      const imageId = `img_${images.length + 1}`;
      images.push({
        id: imageId,
        data: node.backgroundImage
      });
      imageMap.set(node.backgroundImage, imageId);
      processedNode.backgroundImage = imageId;
    }

    if (node.children) {
      processedNode.children = node.children.map(child => processNode(child));
    }

    return processedNode;
  };

  const processedLayout = boxes.map(box => processNode(box));

  return {
    version: '1.0',
    layout: processedLayout,
    images
  };
};

export const loadLayout = (layoutFile: LayoutFile): BoxState[] => {
  const imageMap = new Map<string, string>();
  layoutFile.images.forEach(img => {
    imageMap.set(img.id, img.data);
  });

  const processNode = (node: BoxState): BoxState => {
    const processedNode = { ...node };

    if (node.backgroundImage && imageMap.has(node.backgroundImage)) {
      processedNode.backgroundImage = imageMap.get(node.backgroundImage);
    }

    if (node.children) {
      processedNode.children = node.children.map(child => processNode(child));
    }

    return processedNode;
  };

  return layoutFile.layout.map(box => processNode(box));
};

export const downloadLayout = (layout: LayoutFile) => {
  const blob = new Blob([JSON.stringify(layout, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `layout_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};