export interface UploadedImage {
  id: string;
  file: File;
  dataUrl: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  url?: string; // For compatibility
}

export interface CellStyle {
  objectFit: 'cover' | 'contain' | 'fill';
  position: { x: number; y: number };
  zoom: number;
}

export interface Cell {
  id: string;
  imageId?: string;
  gridArea?: string;
  rowStart?: number; 
  rowEnd?: number;
  columnStart?: number;
  columnEnd?: number;
  style: CellStyle;
}

export interface StandardGrid {
  type: 'standard';
  rows: number;
  columns: number;
  cells: Cell[];
}

export interface SpecialGrid {
  type: 'masonry' | 'featured' | 'mosaic' | 'horizontal' | 'vertical' | 'split' | 'custom';
  orientation?: 'horizontal' | 'vertical';
  columns?: number;
  rows?: number;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridTemplateAreas?: string;
  cells: Cell[];
}

export type GridType = StandardGrid | SpecialGrid;

export interface CollageOptions {
  cellGap: number;
  cellSpacing?: number;
  cellBorderRadius: number;
  backgroundColor: string;
  cellBorderWidth: number;
  cellBorderColor: string;
  padding: number;
}

export interface DragItem {
  type: 'IMAGE';
  imageId: string;
  index: number;
}

export interface GridTemplate {
  name: string;
  type: 'standard' | 'masonry' | 'featured' | 'mosaic' | 'horizontal' | 'vertical' | 'split' | 'custom';
  rows?: number;
  columns?: number;
  orientation?: 'portrait' | 'landscape' | 'square' | 'mixed';
  variant?: string;
}