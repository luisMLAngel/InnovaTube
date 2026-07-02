import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { Video } from '../interfaces/video.interface';
import { YoutubeService } from '../services/youtube.service';
import {
  CompactSearchComponent,
  SearchEvent,
} from '../../../shared/components/ui/compact-search.component';
import { VideoListComponent } from '../../../shared/components/video-list.component';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  imports: [CompactSearchComponent, VideoListComponent],
})
export class VideosPage implements OnInit {
  @ViewChild('searchCmp') searchCmp!: CompactSearchComponent;

  private readonly youtubeService = inject(YoutubeService);

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
}
