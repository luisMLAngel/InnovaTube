import { Component, effect, input, output, signal } from '@angular/core';
import { VideoCardComponent } from './video-card.component';
import { Video } from '../../features/videos/interfaces/video.interface';
import { EmptyStateComponent, EmptyStateConfig } from './ui/empty-state.component';

@Component({
  selector: 'app-video-list',
  imports: [VideoCardComponent, EmptyStateComponent],
  template: `
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      @for (video of internalVideos(); track video) {
        <app-video-card [video]="video" (favoriteToggled)="onFavoriteToggled($event)" />
      } @empty {
        <app-empty-state [config]="emptyConfig"></app-empty-state>
      }
    </div>
  `,
})
export class VideoListComponent {
  videos = input.required<Video[]>();

  internalVideos = signal<Video[]>([]);
  toggledFavorite = output<Video>();

  emptyConfig: EmptyStateConfig = {
    title: 'No se han encontrado videos',
    description: 'Prueba cambiando los parámetros de búsqueda',
    variant: 'empty',
  };

  constructor() {
    effect(() => {
      this.internalVideos.set(this.videos());
    });
  }

  onFavoriteToggled(video: Video): void {
    this.internalVideos.update(list =>
      list.map(v => (v.id === video.id ? { ...v, isFavorite: !v.isFavorite } : v)),
    );
    this.toggledFavorite.emit(video);
  }
}
