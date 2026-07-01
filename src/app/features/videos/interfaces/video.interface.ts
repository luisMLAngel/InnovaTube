// video.model.ts
export interface Video {
  id: string;
  youtubeVideoId: string;
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string; // ISO date
  isFavorite: boolean;
}
