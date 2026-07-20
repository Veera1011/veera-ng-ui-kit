import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'ui-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ui-alert" [ngClass]="'ui-alert-' + type">
      <div class="ui-alert-body">
        <strong *ngIf="title">{{ title }}</strong>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .ui-alert {
      display: flex; gap: var(--space-3); align-items: flex-start;
      padding: var(--space-4);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
    }
    .ui-alert-body strong { display: block; font-weight: var(--font-weight-semibold); margin-bottom: 2px; }
    .ui-alert-success { background: var(--color-semantic-success-bg); color: var(--color-semantic-success); }
    .ui-alert-warning { background: var(--color-semantic-warning-bg); color: var(--color-semantic-warning); }
    .ui-alert-danger { background: var(--color-semantic-danger-bg); color: var(--color-semantic-danger); }
    .ui-alert-info { background: var(--color-primary-50); color: var(--color-primary-700); }
  `],
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() title = '';
}
