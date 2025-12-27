
export enum ToolType {
  DASHBOARD = 'DASHBOARD',
  IMAGE = 'IMAGE',
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
  LIVE = 'LIVE'
}

export interface TranscriptionEntry {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ProcessingState {
  isProcessing: boolean;
  message?: string;
}
