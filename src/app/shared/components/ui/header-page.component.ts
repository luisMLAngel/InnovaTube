import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-header-page',
  template: `
    <header>
      <h1 class="text-2xl font-medium text-ink-primary-w mb-1">{{ title() }}</h1>
      @if (subtitle()) {
        <p class="text-sm text-ink-secondary-w">{{ subtitle() }}</p>
      }
    </header>
  `,
  styles: [``],
  imports: [CommonModule],
})
export class HeaderPageComponent {
  title: InputSignal<string> = input<string>('Página sin título');
  subtitle: InputSignal<string | null> = input<string | null>(null);
}
