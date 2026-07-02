import { Component, inject } from '@angular/core';
import { LoaderService } from '../services';

export const EXCLUDE_HEADERS_SKIP_LOADER: string = 'X-Skip-Loader';

@Component({
  selector: 'app-loader',
  template: `
    @if (loaderService.visible()) {
      <div class="loader">
        <div class="loader-container">
          <div class="loader-dot"></div>
          <div class="loader-dot"></div>
          <div class="loader-dot"></div>
          <div class="loader-dot"></div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .loader {
        @apply fixed top-0 left-0 w-full h-full flex items-center bg-black/80 justify-center z-50;
      }
      .loader-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3.75em;
      }

      .loader-dot {
        height: 0.8125em;
        width: 1.25em;
        margin-right: 0.625em;
        border-radius: 0.625em;
        background-color: #721a8f;
        animation: loaderpulse 1.5s infinite ease-in-out;
      }

      .loader-dot:last-child {
        margin-right: 0;
      }

      .loader-dot:nth-child(1) {
        animation-delay: -0.1875s;
      }

      .loader-dot:nth-child(2) {
        animation-delay: -0.0625s;
      }

      .loader-dot:nth-child(3) {
        animation-delay: 0.0625s;
      }

      @keyframes loaderpulse {
        0% {
          transform: scale(0.8);
          background-color: #d7b3fc;
          box-shadow: 0 0 0 0 rgb(196 178 252 / 70%);
        }

        50% {
          transform: scale(1.2);
          background-color: #70198e;
          box-shadow: 0 0 0 0.625em rgba(178, 212, 252, 0);
        }

        100% {
          transform: scale(0.8);
          background-color: #d7b3fc;
          box-shadow: 0 0 0 0 rgb(196 178 252 / 70%);
        }
      }
    `,
  ],
})
export class LoaderComponent {
  protected readonly loaderService = inject(LoaderService);
}
