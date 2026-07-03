import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { Video } from '../interfaces/video.interface';
import { YoutubeService } from '../services/youtube.service';
import {
  CompactSearchComponent,
  SearchEvent,
} from '../../../shared/components/ui/compact-search.component';
import { VideoListComponent } from '../../../shared/components/video-list.component';
import { VideoService } from '../services/video.service';
import { MessageService } from 'primeng/api';
import { HeaderPageComponent } from '../../../shared/components';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  imports: [CompactSearchComponent, VideoListComponent, HeaderPageComponent],
})
export class VideosPage implements OnInit {
  @ViewChild('searchCmp') searchCmp!: CompactSearchComponent;

  private readonly youtubeService = inject(YoutubeService);
  private readonly videoService = inject(VideoService);
  protected readonly messageService: MessageService = inject(MessageService);

  videos: Video[] = [];

  ngOnInit(): void {
    this.loadPopularVideos();
  }

  onSearch(event: SearchEvent): void {
    this.youtubeService.searchVideos(event.query).subscribe({
      next: async videos => {
        this.videos = await this.markFavoritesIfExist(videos);
        this.searchCmp?.setSuccess(this.videos.length > 0);
      },
      error: () => {
        this.searchCmp?.setError();
      },
    });
  }

  onClear(): void {
    this.loadPopularVideos();
  }

  private async loadPopularVideos(): Promise<void> {
    try {
      const videos = await this.youtubeService.getPopularVideos().toPromise();
      this.videos = await this.markFavoritesIfExist(videos ?? []);
    } catch {
      this.videos = [];
    }
  }

  private async markFavoritesIfExist(videos: Video[]): Promise<Video[]> {
    try {
      const favorites = await this.videoService.getFavoriteVideos();
      const favoriteIds = new Set(favorites.map(f => f.Video.youtubeVideoId));
      return videos.map(video => ({
        ...video,
        isFavorite: favoriteIds.has(video.youtubeVideoId),
      }));
    } catch {
      return videos;
    }
  }

  async onToggledFavorite(video: Video): Promise<void> {
    try {
      if (video.isFavorite) {
        await this.videoService.markAsUnFavorite(video);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Video desmarcado como favorito',
        });
      } else {
        await this.videoService.markAsFavorite(video);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Video marcado como favorito',
        });
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: (error as Error).message,
      });
    }
  }
}
