import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
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

  protected readonly userFacadeService = inject(UserFacadeService);
  private readonly router = inject(Router);
  constructor() {}

  ngOnInit(): void {
    this.userFacadeService
      .me()
      .then(() => {
        if (this.router.url === '/' || this.router.url.includes('/auth')) {
          this.router.navigate(['videos']);
        }
      })
      .catch(e => {
        this.router.navigate(['auth', 'login']);
      });
  }
}
