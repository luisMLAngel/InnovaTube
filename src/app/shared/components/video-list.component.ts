import { Component, effect, input, signal } from '@angular/core';
import { VideoCardComponent } from './video-card.component';
import { Video } from '../../features/videos/interfaces/video.interface';

@Component({
  selector: 'app-video-list',
  imports: [VideoCardComponent],
  template: `
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      @for (video of internalVideos(); track video) {
        <app-video-card [video]="video" (favoriteToggled)="onFavoriteToggled($event)" />
      }
    </div>
  `,
})
export class VideoListComponent {
  videos = input.required<Video[]>();

  internalVideos = signal<Video[]>([]);

  constructor() {
    effect(() => {
      this.internalVideos.set(this.videos());
    });
  }

  onFavoriteToggled(video: Video): void {
    this.internalVideos.update(list =>
      list.map(v => (v.id === video.id ? { ...v, isFavorite: !v.isFavorite } : v)),
    );
  }
}
