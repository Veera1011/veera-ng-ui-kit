import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'ui-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ui-toast-stack">
      <div class="ui-toast" *ngFor="let toast of toastService.toasts$ | async">
        <span class="ui-toast-dot"></span>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  `,
  styles: [`
    .ui-toast-stack {
      position: fixed; bottom: var(--space-5); right: var(--space-5);
      display: flex; flex-direction: column; gap: var(--space-3);
      z-index: 200;
    }
    .ui-toast {
      display: flex; align-items: center; gap: var(--space-3);
      background: var(--color-black); color: var(--color-white);
      padding: var(--space-4) var(--space-5);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      font-size: var(--font-size-sm);
      min-width: 260px;
    }
    .ui-toast-dot { width: 8px; height: 8px; border-radius: 999px; background: var(--color-primary-500); flex-shrink: 0; }
  `],
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}
