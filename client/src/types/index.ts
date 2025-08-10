// 用戶類型定義
export interface User {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  identity?: string;
  date?: string;
}

// API 響應類型
export interface ApiResponse<T = any> {
  msg: string;
  success: boolean;
  data?: T;
}

// 動畫歌曲類型
export interface AnimeSong {
  id?: string;
  title: string;
  artist: string;
  anime: string;
  year?: number;
  genre?: string;
  imageUrl?: string;
  audioUrl?: string;
  date?: string;
}

// 收藏清單類型
export interface PlayList {
  _id?: string;
  name: string;
  description?: string;
  userId: string;
  songs: string[] | AnimeSong[];
  isDefault?: boolean;
  date?: string;
}

// 路由守衛類型
export interface RouteGuard {
  to: any;
  from: any;
  next: (path?: string) => void;
}

// 本地存儲類型
export interface LocalStorage {
  eleToken?: string;
}

// 擴展 Window 對象
declare global {
  interface Window {
    ResizeObserver: any;
  }
} 