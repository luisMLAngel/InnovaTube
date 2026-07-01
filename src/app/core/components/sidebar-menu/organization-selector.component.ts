import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { tablerArrowNarrowDown, tablerArrowNarrowUp } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-organization-selector',
  template: `
    <div
      class="org-selector flex items-center justify-between bg-selected-w p-2 rounded-md border border-stroke-w cursor-pointer transition-all duration-200 hover:bg-opacity-80"
    >
      <div class="flex items-center gap-2">
        <div
          class="flex justify-center items-center aspect-square overflow-hidden w-8 h-8 rounded-sm bg-theme-w p-1"
        >
          <img [src]="organizationLogoUrl()" class="object-cover" />
        </div>
        <p class="text-base font-medium text-ink-primary-w">{{ organizationName() }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .org-selector:hover .arrow-up {
        animation: arrowUpBounce 0.6s ease-in-out infinite;
      }

      .org-selector:hover .arrow-down {
        animation: arrowDownBounce 0.6s ease-in-out infinite;
      }

      @keyframes arrowUpBounce {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-3px);
        }
      }

      @keyframes arrowDownBounce {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(3px);
        }
      }

      .arrows-container {
        transition: all 0.2s ease-in-out;
      }

      .org-selector:hover .arrows-container {
        transform: scale(1.1);
      }
    `,
  ],
  imports: [CommonModule],
  providers: [provideIcons({ tablerArrowNarrowDown, tablerArrowNarrowUp })],
})
export class OrganizationSelectorComponent {
  organizationName: InputSignal<string> = input<string>('No definido');
  organizationLogoUrl: InputSignal<string> = input<string>(
    'https://www.logoai.com/oss/icons/2021/10/27/MuCSnBxFpOQg2Kl.png',
  );
}
