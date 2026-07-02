// video.model.ts
export interface Video {
  id: string;
  youtubeVideoId: string;
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  isFavorite: boolean;
}

export interface CreateFavoriteVideoInterface {
  userId: string;
  videoId?: string;
  youtubeVideoId: string;
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
}

export interface FavoriteVideo {
  id: string;
  userId: string;
  videoId: string;
  createdAt: Date;
  Video: Video;
}
