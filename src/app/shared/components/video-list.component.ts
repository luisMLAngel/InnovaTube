// video-list.component.ts (o donde tengas tu vista principal)
import { Component, signal } from '@angular/core';
import { VideoCardComponent } from './video-card.component';
import { MOCK_VIDEOS } from '../../features/videos/services/mock_videos';
import { Video } from '../../features/videos/interfaces/video.interface';

@Component({
  selector: 'app-video-list',
  imports: [VideoCardComponent],
  template: `
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      @for (video of videos(); track video.id) {
        <app-video-card [video]="video" (favoriteToggled)="onFavoriteToggled($event)" />
      }
    </div>
  `,
})
export class VideoListComponent {
  videos = signal<Video[]>(MOCK_VIDEOS);

  onFavoriteToggled(video: Video): void {
    this.videos.update(list =>
      list.map(v => (v.id === video.id ? { ...v, isFavorite: !v.isFavorite } : v)),
    );
  }
}
