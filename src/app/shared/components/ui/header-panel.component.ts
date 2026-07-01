import { CommonModule } from '@angular/common';
import { Component, input, InputSignal, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-header-panel',
  template: `
    <div>
      <h2 class="text-lg text-ink-primary-w mb-1">{{ title() }}</h2>
      @if (subtitle()) {
        <p class="text-sm text-ink-secondary-w">{{ subtitle() }}</p>
      }
      @if (extraInfo()) {
        <ng-container *ngTemplateOutlet="extraInfo()"></ng-container>
      }
    </div>
  `,
  styles: [``],
  imports: [CommonModule],
})
export class HeaderPanelComponent {
  title: InputSignal<string> = input<string>('Panel sin título');
  subtitle: InputSignal<string | null> = input<string | null>(null);
  extraInfo: InputSignal<TemplateRef<any> | null> = input<TemplateRef<any> | null>(null);
}
