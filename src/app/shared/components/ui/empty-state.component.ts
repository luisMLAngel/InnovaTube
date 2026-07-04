import { ChangeDetectionStrategy, Component, InputSignal, computed, input } from '@angular/core';
import { Button } from 'primeng/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerBug, tablerInboxOff, tablerSearchOff } from '@ng-icons/tabler-icons';

export type EmptyStateVariant = 'empty' | 'search' | 'error';

export interface EmptyStateAction {
  label: string;
  action: () => void;
}

export interface EmptyStateConfig {
  variant: EmptyStateVariant;
  title: string;
  description?: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
}

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-canvas-w flex flex-col">
      <div class="w-12 h-12 p-2 rounded-full bg-overlay-w flex items-center justify-center">
        <ng-icon [name]="icon()" class="text-xl"></ng-icon>
      </div>
      <h2 class="mt-4 text-base text-ink-primary">{{ config().title }}</h2>
      @if (config().description) {
        <p class="mt-2 text-xs text-ink-secondary">
          {{ config().description }}
        </p>
      }

      <div class="flex items-center gap-4 mt-6">
        @if (config().primaryAction) {
          <p-button
            severity="secondary"
            size="small"
            label="{{ config().primaryAction?.label }}"
            (onClick)="config().primaryAction?.action()"
          ></p-button>
        }
        @if (config().secondaryAction) {
          <p-button
            size="small"
            variant="text"
            severity="secondary"
            label="{{ config().secondaryAction?.label }}"
            (onClick)="config().secondaryAction?.action()"
          ></p-button>
        }
      </div>
    </div>
  `,
  imports: [Button, NgIcon],
  providers: [provideIcons({ tablerInboxOff, tablerBug, tablerSearchOff })],
})
export class EmptyStateComponent {
  config: InputSignal<EmptyStateConfig> = input.required<EmptyStateConfig>();

  readonly icon = computed(() => {
    switch (this.config()?.variant) {
      case 'search':
        return 'tablerSearchOff';
      case 'error':
        return 'tablerBug';
      default:
        return 'tablerInboxOff';
    }
  });
}
