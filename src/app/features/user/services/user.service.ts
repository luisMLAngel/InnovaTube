import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MeInterface, UserInterface } from '../../../core/interfaces';
import { environment } from '../../../environments';
import { BaseService } from '../../../shared/http/base/base.service';
import { DataBaseServiceResponse } from '../../../shared/http/base/interfaces/data-base-service-response.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly SERVER: string = environment.SERVER;
  private readonly baseService = inject(BaseService);
  constructor() {}

  async me(): Promise<UserInterface> {
    const response: DataBaseServiceResponse<UserInterface> = await firstValueFrom(
      this.baseService.get<UserInterface>(`${this.SERVER}/users/me`),
    );
    if (response.error) {
      throw new Error(response.message);
    }
    return response.entity!;
  }
}
