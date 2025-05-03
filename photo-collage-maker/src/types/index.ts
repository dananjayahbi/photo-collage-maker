export interface CollageImage {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
  aspectRatio: number;
  cellIndex?: number;
}

export interface GridCell {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  imageId?: string;
}

export interface CollageGrid {
  rows: number;
  columns: number;
  width: number;
  height: number;
  cells: GridCell[];
}

export interface CollageState {
  images: CollageImage[];
  grid: CollageGrid | null;
  selectedCellId: string | null;
  selectedImageId: string | null;
}

export type ImageFit = 'fill' | 'contain' | 'cover' | 'none';

export interface CollageOptions {
  backgroundColor: string;
  cellSpacing: number;
  imageFit: ImageFit;
}