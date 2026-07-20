import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-dropdown-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button type="button" class="ui-dropdown-item" [class.is-danger]="danger">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .ui-dropdown-item {
      display: flex; align-items: center; gap: var(--space-2);
      width: 100%; text-align: left;
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-sm);
      border: none; background: none;
      font-size: var(--font-size-sm);
      color: var(--color-black);
      cursor: pointer;
    }
    .ui-dropdown-item:hover { background: var(--color-gray-50); }
    .ui-dropdown-item.is-danger { color: var(--color-semantic-danger); }
    .ui-dropdown-item.is-danger:hover { background: var(--color-semantic-danger-bg); }
  `],
})
export class DropdownItemComponent {
  @Input() danger = false;
}
