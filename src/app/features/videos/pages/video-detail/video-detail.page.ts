import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { VideoService } from '../../services/video.service';
import { Video } from '../../interfaces/video.interface';
import { MessageService } from 'primeng/api';
import { HeaderPageComponent } from '../../../../shared/components';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YoutubeService } from '../../services/youtube.service';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.page.html',
  imports: [DatePipe, ButtonModule, HeaderPageComponent],
})
export class VideoDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly videoService = inject(VideoService);
  private readonly youtubeService = inject(YoutubeService);
  private readonly messageService = inject(MessageService);
  private sanitizer = inject(DomSanitizer);

  video = signal<Video | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    const videoId = this.route.snapshot.paramMap.get('id');
    if (videoId) {
      this.loadVideo(videoId);
    } else {
      this.router.navigate(['/videos']);
    }
  }

  embedUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.video()?.youtubeVideoId}`,
    ),
  );

  private async loadVideo(videoId: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const favorites = await this.videoService.getFavoriteVideos();
      const favorite = favorites.find(f => f.Video.youtubeVideoId === videoId);

      if (favorite) {
        this.video.set({
          ...favorite.Video,
          isFavorite: true,
        });
      } else {
        const video = await this.youtubeService.findVideo(videoId);
        this.video.set({
          ...video,
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          isFavorite: false,
        });
      }
    } catch {
      this.video.set({
        id: videoId,
        youtubeVideoId: videoId,
        title: 'Video de YouTube',
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        channelTitle: 'Canal de YouTube',
        publishedAt: new Date().toISOString(),
        isFavorite: false,
      });
    } finally {
      this.isLoading.set(false);
    }
  }

  async toggleFavorite(): Promise<void> {
    const currentVideo = this.video();
    if (!currentVideo) return;

    try {
      if (currentVideo.isFavorite) {
        await this.videoService.markAsUnFavorite(currentVideo);
        this.video.set({ ...currentVideo, isFavorite: false });
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Video eliminado de favoritos',
        });
      } else {
        await this.videoService.markAsFavorite(currentVideo);
        this.video.set({ ...currentVideo, isFavorite: true });
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Video agregado a favoritos',
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

  goBack(): void {
    window.history.back();
  }
}
