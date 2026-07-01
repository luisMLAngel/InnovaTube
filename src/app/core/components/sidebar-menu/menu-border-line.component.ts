import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { tablerArrowsMoveHorizontal } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-menu-border-line',
  template: ` <div class="menu-border-line">
    <div class="min-w-5 min-h-5 flex items-center justify-center cursor-pointer">
      <ng-icon name="tablerArrowsMoveHorizontal" class="text-xl relative left-[-1px]"></ng-icon>
    </div>
  </div>`,
  styles: [
    `
      .menu-border-line {
        @apply w-[1px] h-full bg-stroke-w flex items-center justify-center cursor-col-resize absolute hover:bg-primary-w hover:w-[2px] transition-all;
      }
    `,
  ],
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ tablerArrowsMoveHorizontal })],
})
export class MenuBorderLineComponent {}
