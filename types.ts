
export interface UploadedImage {
    base64: string;
    mimeType: string;
}

export interface OutputConfig {
  id: string;
  count: number;
  title: string;
  prompt: string;
}

export interface GeneratedImage {
  id: string;
  src: string;
}

export interface GeneratedImageData {
  [key: string]: GeneratedImage[];
}
