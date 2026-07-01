import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthFacadeService } from './features/auth/services';
import { LoaderComponent } from './shared/components/loader.component';
import { UserFacadeService } from './features/user/services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ToastModule, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService],
})
export class AppComponent implements OnInit {
  title = 'innovatube-frontend';

  private readonly authFacadeService = inject(AuthFacadeService);
  protected readonly userFacadeService = inject(UserFacadeService);
  private readonly router = inject(Router);
  constructor() {}

  ngOnInit(): void {
    this.authFacadeService.refreshToken().then(() => {
      this.userFacadeService.me().then(() => {
        // solo mandar a follow-ups cuando al ruta sea la raiz
        if (this.router.url === '/') {
          this.router.navigate(['/', 'o', 'follow-ups']);
        }
      });
    });
  }
}
