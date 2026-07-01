import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MeInterface } from '../../../core/interfaces';
import { environment } from '../../../environments';
import { BaseService } from '../../../shared/http/base/base.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly SERVER: string = environment.SERVER;
  private readonly baseService = inject(BaseService);
  constructor() {}

  async me(): Promise<MeInterface> {
    const response: MeInterface = await firstValueFrom(
      this.baseService.getv2<MeInterface>(`${this.SERVER}/users/me`),
    );

    return response;
  }
}
