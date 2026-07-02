// compact-search.component.ts
import {
  Component,
  InputSignal,
  OutputEmitterRef,
  computed,
  effect,
  input,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerSearch, tablerX, tablerArrowRight, tablerLoader2 } from '@ng-icons/tabler-icons';

export type SearchStatus = 'idle' | 'typing' | 'loading' | 'success' | 'empty' | 'error';

export interface SearchEvent {
  query: string;
}

@Component({
  selector: 'app-compact-search',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, TooltipModule, NgIconComponent],
  providers: [
    provideIcons({
      tablerSearch,
      tablerX,
      tablerArrowRight,
      tablerLoader2,
    }),
  ],
  template: `
    <div class="search-root">
      <div class="search-input">
        <ng-icon name="tablerSearch" class="icon"></ng-icon>

        <input
          pInputText
          type="text"
          [placeholder]="placeholder()"
          [value]="query()"
          (input)="onInput($any($event.target).value)"
          (keydown.enter)="triggerSearch()"
          [disabled]="disabled()"
        />

        @if (query()) {
          <button pButton type="button" severity="secondary" class="clear-btn" (click)="clear()">
            <ng-icon name="tablerX"></ng-icon>
          </button>
        }
      </div>

      @if (showStatus()) {
        <div class="status">
          @switch (status()) {
            @case ('typing') {
              <span>Escribiendo…</span>
            }
            @case ('loading') {
              <span>Buscando…</span>
            }
            @case ('success') {
              <span class="success">Resultados</span>
            }
            @case ('empty') {
              <span class="warn">Sin resultados</span>
            }
            @case ('error') {
              <span class="error">Error</span>
            }
          }
        </div>
      }

      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .search-root {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        width: 100%;
      }

      .search-input {
        @apply relative w-full;
      }

      .search-input input {
        @apply w-full pl-10 pr-10;
      }

      .icon {
        @apply absolute left-3 top-1/2 -translate-y-1/2 text-lg text-ink-secondary-w;
      }

      .clear-btn {
        @apply absolute right-2 top-1/2 -translate-y-1/2;
      }

      .spin {
        animation: spin 0.9s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .status {
        @apply text-sm pt-1 text-ink-secondary-w;
      }

      .success {
        color: var(--green-600);
      }

      .warn {
        color: var(--yellow-600);
      }

      .error {
        color: var(--red-600);
      }
    `,
  ],
})
export class CompactSearchComponent {
  // ==============================
  // Inputs (Signal-based)
  // ==============================

  readonly placeholder: InputSignal<string> = input('Buscar…');
  readonly disabled: InputSignal<boolean> = input(false);
  readonly debounceMs: InputSignal<number> = input(300);
  readonly autoSearch: InputSignal<boolean> = input(true);

  // ==============================
  // Outputs (Signal-based)
  // ==============================

  readonly search: OutputEmitterRef<SearchEvent> = output();
  readonly cleared: OutputEmitterRef<void> = output();

  // ==============================
  // Internal state
  // ==============================

  readonly query: WritableSignal<string> = signal('');
  readonly status: WritableSignal<SearchStatus> = signal('idle');

  private debounceTimer: any;

  readonly showStatus = computed(() =>
    ['typing', 'loading', 'success', 'empty', 'error'].includes(this.status()),
  );

  constructor() {
    effect(() => {
      const q = this.query();
      const auto = this.autoSearch();
      const delay = this.debounceMs();

      if (!auto) return;

      if (!q) {
        this.status.set('idle');
        this.cleared.emit();
        return;
      }

      this.status.set('typing');

      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.triggerSearch();
      }, delay);
    });
  }

  // ==============================
  // Public API
  // ==============================

  onInput(value: string) {
    this.query.set(value);
  }

  triggerSearch() {
    const q = this.query();
    if (!q || this.status() === 'loading') return;

    this.status.set('loading');
    this.search.emit({ query: q });
  }

  clear() {
    this.query.set('');
    this.status.set('idle');
    this.cleared.emit();
  }

  // ==============================
  // Status setters for parent
  // ==============================

  setSuccess(hasResults: boolean) {
    this.status.set(hasResults ? 'success' : 'empty');
  }

  setError() {
    this.status.set('error');
  }
}

// ============================================
// Example usage with PrimeNG p-table
// ============================================

/*

<app-compact-search
  placeholder="Buscar clientes"
  (search)="onSearch($event)"
  (cleared)="onClear()"
  #searchCmp
></app-compact-search>

<p-table [value]="clients()">
  <ng-template pTemplate="header">
    <tr>
      <th>Nombre</th>
      <th>Email</th>
    </tr>
  </ng-template>

  <ng-template pTemplate="body" let-row>
    <tr>
      <td [innerHTML]="row.name | highlight : searchCmp.query()"></td>
      <td [innerHTML]="row.email | highlight : searchCmp.query()"></td>
    </tr>
  </ng-template>
</p-table>


// parent.component.ts

clients = signal<Client[]>([]);

onSearch({ query }: SearchEvent) {
  this.api.searchClients(query).subscribe({
    next: data => {
      this.clients.set(data);
      this.searchCmp.setSuccess(data.length > 0);
    },
    error: () => this.searchCmp.setError(),
  });
}

onClear() {
  this.clients.set([]);
}

*/
