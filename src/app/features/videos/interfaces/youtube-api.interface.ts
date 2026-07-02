/** Respuesta de YouTube Data API v3 - Search */
export interface YouTubeSearchResponse {
  kind: string;
  etag: string;
  nextPageToken: string;
  pageInfo: YouTubePageInfo;
  items: YouTubeSearchItem[];
}

export interface YouTubePageInfo {
  totalResults: number;
  resultsPerPage: number;
}

export interface YouTubeSearchItem {
  kind: string;
  etag: string;
  id: YouTubeResourceId;
  snippet: YouTubeSnippet;
}

export interface YouTubeResourceId {
  kind: string;
  videoId: string;
}

export interface YouTubeSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: YouTubeThumbnails;
  channelTitle: string;
  liveBroadcastContent: string;
}

export interface YouTubeThumbnails {
  default: YouTubeThumbnail;
  medium: YouTubeThumbnail;
  high: YouTubeThumbnail;
}

export interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}
