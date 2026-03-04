export interface SearchResult {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  duration?: number;
}

export interface StreamInfo {
  url: string;
  expiresAt: number;
}

export interface Playlist {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  songs?: PlaylistSong[];
}

export interface PlaylistSong {
  id: number;
  videoId: string;
  title: string;
  thumbnailUrl: string | null;
  duration: number | null;
  position: number;
}

export interface ApiError {
  error: {
    message: string;
    code: string;
  };
}
