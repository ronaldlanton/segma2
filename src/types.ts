export interface BoxState {
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