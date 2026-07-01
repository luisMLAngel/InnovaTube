import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  visible: WritableSignal<boolean> = signal(false);
  private counter = 0;
  private hideTimeout?: any;

  show(): void {
    this.counter++;
    clearTimeout(this.hideTimeout);
    this.visible.set(true);
  }

  hide(): void {
    this.counter = Math.max(0, this.counter - 1);
    if (this.counter === 0) {
      // ocultar loader visualmente
      this.visible.set(false);
    }
  }

  hideAfter(ms: number): void {
    this.counter = Math.max(0, this.counter - 1);
    if (this.counter !== 0) return;

    this.hideTimeout = setTimeout(() => {
      if (this.counter === 0) {
        // ocultar loader visualmente
        this.visible.set(false);
      }
    }, ms);
  }
}
