import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments';
import { Video } from '../interfaces/video.interface';
import { YouTubeSearchResponse } from '../interfaces/youtube-api.interface';

@Injectable({ providedIn: 'root' })
export class YoutubeService {
  private readonly http = inject(HttpClient);
  private readonly API_KEY = environment.YOUTUBE_API_KEY;
  private readonly BASE_URL = 'https://www.googleapis.com/youtube/v3';
  private readonly MAX_RESULTS = 12;

  searchVideos(query: string): Observable<Video[]> {
    const params = {
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: this.MAX_RESULTS.toString(),
      key: this.API_KEY,
    };

    return this.http
      .get<YouTubeSearchResponse>(`${this.BASE_URL}/search`, { params })
      .pipe(map(response => this.mapToVideos(response)));
  }

  getPopularVideos(): Observable<Video[]> {
    const params = {
      part: 'snippet',
      chart: 'mostPopular',
      regionCode: 'MX',
      maxResults: this.MAX_RESULTS.toString(),
      key: this.API_KEY,
    };

    return this.http
      .get<YouTubeSearchResponse>(`${this.BASE_URL}/videos`, { params })
      .pipe(map(response => this.mapToVideos(response)));
  }

  private mapToVideos(response: YouTubeSearchResponse): Video[] {
    return response.items.map(item => ({
      id: item.id.videoId,
      youtubeVideoId: item.id.videoId,
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      isFavorite: false,
    }));
  }
}
