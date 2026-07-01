import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
  imports: [CommonModule, ButtonModule],
  standalone: true,
})
export class NotFoundPage {
  constructor(private router: Router) {}

  goToHome(): void {
    this.router.navigate(['/o/follow-ups']);
  }

  goBack(): void {
    window.history.back();
  }
}
