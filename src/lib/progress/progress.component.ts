import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ProgressVariant = 'primary' | 'success' | 'danger';

@Component({
  selector: 'ui-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ui-progress">
      <div class="ui-progress-label" *ngIf="label">
        <span>{{ label }}</span>
        <span>{{ value }}%</span>
      </div>
      <div class="ui-progress-track">
        <div class="ui-progress-fill" [ngClass]="'is-' + variant" [style.width.%]="value"></div>
      </div>
    </div>
  `,
  styles: [`
    .ui-progress { width: 100%; max-width: 320px; }
    .ui-progress-label { display: flex; justify-content: space-between; font-size: var(--font-size-xs); color: var(--color-gray-500); margin-bottom: var(--space-2); }
    .ui-progress-track { height: 8px; background: var(--color-gray-100); border-radius: 999px; overflow: hidden; }
    .ui-progress-fill { height: 100%; border-radius: 999px; background: var(--color-primary-500); transition: width var(--motion-duration-base) var(--motion-ease-standard); }
    .ui-progress-fill.is-success { background: var(--color-semantic-success); }
    .ui-progress-fill.is-danger { background: var(--color-semantic-danger); }
    .ui-progress-fill.is-primary { background: var(--color-primary-500); }
  `],
})
export class ProgressComponent {
  @Input() value = 0;
  @Input() label = '';
  @Input() variant: ProgressVariant = 'primary';
}
