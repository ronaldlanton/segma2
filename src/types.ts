export interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type Direction = 'horizontal' | 'vertical';

export interface BoxState {
  id: string;
  padding: Padding;
  backgroundColor: string;
  backgroundImage: string | null;
  children: [BoxState, BoxState] | null;
  splitDirection: Direction | null;
}

export interface LayoutImage {
  id: string;
  data: string;
}

export interface LayoutFile {
  boxes: BoxState[];
  images: LayoutImage[];
}