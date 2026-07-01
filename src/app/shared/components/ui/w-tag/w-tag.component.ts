import { Component, Input, InputSignal, computed, input } from '@angular/core';
import { provideIcons, NgIcon } from '@ng-icons/core';
import {
  tablerCircleDashed,
  tablerCircleDashedCheck,
  tablerCircleHalf2,
  tablerCircle,
  tablerProgressCheck,
  tablerCircleDashedX,
} from '@ng-icons/tabler-icons';
import { TagModule } from 'primeng/tag';

export type WStatusTone = 'neutral' | 'info' | 'danger' | 'success';
export type WStatusVariant = 'soft' | 'solid' | 'outline';
export type WStatusSize = 'sm' | 'md';

@Component({
  selector: 'w-status-tag',
  standalone: true,
  imports: [TagModule, NgIcon],
  templateUrl: './w-tag.component.html',
  styleUrls: ['./w-tag.component.scss'],
  providers: [
    provideIcons({
      tablerCircleDashed,
      tablerCircleDashedCheck,
      tablerCircleHalf2,
      tablerCircle,
      tablerProgressCheck,
      tablerCircleDashedX,
    }),
  ],
})
export class WStatusTagComponent {
  label: InputSignal<string> = input.required<string>();
  icon: InputSignal<string | null> = input<string | null>(null);
  tone: InputSignal<WStatusTone> = input<WStatusTone>('neutral');
  variant: InputSignal<WStatusVariant> = input<WStatusVariant>('soft');
  size: InputSignal<WStatusSize> = input<WStatusSize>('md');
  rounded = input<boolean>(true);

  styleClass = computed(() =>
    [
      'w-status-tag',
      `w-status-tag--${this.tone()}`,
      `w-status-tag--${this.variant()}`,
      `w-status-tag--${this.size()}`,
    ].join(' '),
  );
}
