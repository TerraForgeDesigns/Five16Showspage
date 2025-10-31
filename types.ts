
export enum Role {
  ADMIN = 'ADMIN',
  VOLUNTEER = 'VOLUNTEER',
}

export enum PhotoStatus {
  PENDING = 'PENDING',
  READY = 'READY',
  HELD = 'HELD',
  FAILED = 'FAILED',
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: Role;
}

export interface Photo {
  id: string;
  eventId: string;
  objectKey: string;
  url: string; // Simplified for frontend
  thumbUrl: string; // Simplified for frontend
  status: PhotoStatus;
  tags: string[];
  createdAt: Date;
}

export interface Event {
  id: string;
  name: string;
  slug: string;
  date: Date;
  location: string;
  backgroundImageUrl?: string;
  backgroundImageAlt?: string;
  writeup?: string; // HTML/Markdown
  photos: Photo[];
  published: boolean;
}

export interface VendorInquiry {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone?: string;
  services: string[];
  notes?: string;
  eventId?: string;
}

export type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error';
};