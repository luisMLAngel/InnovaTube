// video-card.component.ts
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Video } from '../../features/videos/interfaces/video.interface';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="group flex flex-col overflow-hidden rounded-md bg-surface-w cursor-pointer transition-shadow hover:bg-panel-w"
    >
      <!-- Thumbnail -->
      <div class="relative aspect-video w-full overflow-hidden bg-gray-100">
        <img
          [src]="video().thumbnailUrl"
          [alt]="video().title"
          loading="lazy"
          class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />

        <!-- Botón favorito -->
        <button
          type="button"
          (click)="onToggleFavorite($event)"
          [attr.aria-pressed]="video().isFavorite"
          [attr.aria-label]="video().isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
          class="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors hover:bg-white"
        >
          <svg
            [attr.fill]="video().isFavorite ? 'currentColor' : 'none'"
            viewBox="0 0 24 24"
            stroke-width="1.8"
            stroke="currentColor"
            class="h-5 w-5"
            [class.text-red-500]="video().isFavorite"
            [class.text-gray-400]="!video().isFavorite"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>

      <!-- Contenido -->
      <div class="flex flex-1 flex-col gap-1 p-4">
        <h3
          class="line-clamp-2 text-sm font-medium leading-snug text-ink-primary-w"
          [title]="video().title"
        >
          {{ video().title }}
        </h3>

        <div class="flex flex-1 justify-between mt-2">
          <p class="text-xs text-ink-secondary-w" [title]="video().channelTitle">
            {{ video().channelTitle }}
          </p>

          <p class="text-xs text-ink-muted-w">
            {{ video().publishedAt | date: 'mediumDate' }}
          </p>
        </div>
      </div>
    </article>
  `,
})
export class VideoCardComponent {
  video = input.required<Video>();
  favoriteToggled = output<Video>();

  onToggleFavorite(event: Event): void {
    event.stopPropagation(); // evita que dispare click del card si tienes uno padre
    this.favoriteToggled.emit(this.video());
  }
}
