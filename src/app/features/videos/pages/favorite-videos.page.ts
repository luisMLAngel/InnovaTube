import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { Video } from '../interfaces/video.interface';
import {
  CompactSearchComponent,
  SearchEvent,
} from '../../../shared/components/ui/compact-search.component';
import { VideoListComponent } from '../../../shared/components/video-list.component';
import { VideoService } from '../services/video.service';
import { MessageService } from 'primeng/api';
import { HeaderPageComponent } from '../../../shared/components';

@Component({
  selector: 'app-favorite-videos',
  templateUrl: './favorite-videos.page.html',
  imports: [CompactSearchComponent, VideoListComponent, HeaderPageComponent],
})
export class FavoriteVideosPage implements OnInit {
  @ViewChild('searchCmp') searchCmp!: CompactSearchComponent;

  private readonly videoService = inject(VideoService);
  protected readonly messageService = inject(MessageService);
  videos: Video[] = [];

  ngOnInit(): void {
    this.loadFavoriteVideos();
  }

  onSearch(event: SearchEvent): void {
    this.videoService
      .getFavoriteVideos(event.query)
      .then(favorites => {
        this.videos = favorites.map(f => ({
          ...f.Video,
          isFavorite: true,
        }));
        this.searchCmp?.setSuccess(this.videos.length > 0);
      })
      .catch(() => {
        this.searchCmp?.setError();
      });
  }

  onClear(): void {
    this.loadFavoriteVideos();
  }

  private async loadFavoriteVideos(): Promise<void> {
    try {
      console.log('obtener favoritos');
      const favorites = await this.videoService.getFavoriteVideos();
      this.videos = favorites.map(f => ({
        ...f.Video,
        isFavorite: true,
      }));
    } catch {
      this.videos = [];
    }
  }

  async onToggledFavorite(video: Video): Promise<void> {
    try {
      await this.videoService.markAsUnFavorite(video);
      this.videos = this.videos.filter(v => v.youtubeVideoId !== video.youtubeVideoId);
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Video eliminado de favoritos',
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: (error as Error).message,
      });
    }
  }
}
