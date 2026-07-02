import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments';
import { BaseService } from '../../../shared/http/base/base.service';
import { CreateFavoriteVideoInterface, FavoriteVideo, Video } from '../interfaces/video.interface';
import { DataBaseServiceResponse } from '../../../shared/http/base/interfaces/data-base-service-response.interface';
import { firstValueFrom } from 'rxjs';
import { UserFacadeService } from '../../user/services';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private readonly SERVER: string = environment.SERVER;
  private readonly baseService = inject(BaseService);
  private readonly userFacade = inject(UserFacadeService);

  constructor() {}

  async markAsFavorite(video: Video): Promise<void> {
    const user = this.userFacade.user;
    if (!user) {
      throw new Error('No se encuentra información sobre el usuario');
    }
    const data: CreateFavoriteVideoInterface = {
      youtubeVideoId: video.youtubeVideoId,
      title: video.title,
      channelTitle: video.channelTitle,
      publishedAt: video.publishedAt,
      thumbnailUrl: video.thumbnailUrl,
      userId: user()?.id!,
    };
    const response: DataBaseServiceResponse<void> = await firstValueFrom(
      this.baseService.post<void>(`${this.SERVER}/favorites`, data),
    );
    if (response.error) {
      throw new Error(response.message);
    }
  }

  async getFavoriteVideos(search?: string): Promise<FavoriteVideo[]> {
    const user = this.userFacade.user;
    if (!user) {
      throw new Error('No se encuentra información sobre el usuario');
    }
    const response: DataBaseServiceResponse<FavoriteVideo[]> = await firstValueFrom(
      this.baseService.get<FavoriteVideo[]>(`${this.SERVER}/favorites`, void 0, {
        params: { search },
      }),
    );
    if (response.error) {
      throw new Error(response.message);
    }
    return response.entity ?? [];
  }
}
