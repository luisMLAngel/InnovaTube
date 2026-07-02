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
  templateUrl: './favorite-videos.page.html',
  imports: [CompactSearchComponent, VideoListComponent, HeaderPageComponent],
})
export class FavoriteVideosPage implements OnInit {
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
      next: videos => {
        this.videos = videos;
        this.searchCmp?.setSuccess(videos.length > 0);
      },
      error: () => {
        this.searchCmp?.setError();
      },
    });
  }

  onClear(): void {
    this.loadPopularVideos();
  }

  private loadPopularVideos(): void {
    this.youtubeService.getPopularVideos().subscribe({
      next: videos => {
        this.videos = videos;
      },
      error: () => {
        this.videos = [];
      },
    });
  }

  async onToggledFavorite(video: Video): Promise<void> {
    try {
      await this.videoService.markAsFavorite(video);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: (error as Error).message,
      });
    }
  }
}
