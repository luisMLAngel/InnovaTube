import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-template',
  template: `
    <div class="fixed inset-0 bg-auth-w flex items-center justify-center p-4">
      <div class="max-w-md bg-canvas-w rounded-lg shadow-sm">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [``],
  imports: [RouterOutlet],
})
export class AuthTemplate {}
