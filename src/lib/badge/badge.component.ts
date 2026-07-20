import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="ui-badge" [ngClass]="'ui-badge-' + variant">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .ui-badge {
      display: inline-flex;
      align-items: center;
      font-family: var(--font-family-mono);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      letter-spacing: var(--font-letter-spacing-wide);
      text-transform: uppercase;
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      line-height: 1.5;
    }
    .ui-badge-primary { background: var(--color-primary-50); color: var(--color-primary-600); }
    .ui-badge-success { background: var(--color-semantic-success-bg); color: var(--color-semantic-success); }
    .ui-badge-warning { background: var(--color-semantic-warning-bg); color: var(--color-semantic-warning); }
    .ui-badge-danger  { background: var(--color-semantic-danger-bg); color: var(--color-semantic-danger); }
    .ui-badge-neutral { background: var(--color-gray-100); color: var(--color-gray-700); }
  `],
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'neutral';
}
