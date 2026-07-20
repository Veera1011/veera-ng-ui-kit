import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="ui-chip"
      [class.ui-chip-selectable]="selectable"
      [class.ui-chip-selected]="selected"
      (click)="onClick()"
    >
      <span *ngIf="dotColor" class="ui-chip-dot" [style.background]="dotColor"></span>
      <ng-content></ng-content>
      <button
        *ngIf="removable"
        type="button"
        class="ui-chip-remove"
        [attr.aria-label]="'Remove'"
        (click)="onRemove($event)"
      >×</button>
    </span>
  `,
  styles: [`
    .ui-chip {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      border: var(--border-width-thin) solid var(--color-gray-200);
      background: var(--color-white);
      color: var(--color-black);
      transition: background var(--motion-duration-fast) var(--motion-ease-standard),
                  border-color var(--motion-duration-fast) var(--motion-ease-standard);
    }
    .ui-chip-selectable { cursor: pointer; }
    .ui-chip-selectable:hover { border-color: var(--color-gray-500); }
    .ui-chip-selected {
      background: var(--color-primary-50);
      border-color: var(--color-primary-500);
      color: var(--color-primary-700);
    }
    .ui-chip-dot { width: 8px; height: 8px; border-radius: 999px; flex-shrink: 0; }
    .ui-chip-remove {
      border: none; background: none; cursor: pointer;
      color: var(--color-gray-500); font-size: 1em; line-height: 1;
      padding: 0; margin-left: var(--space-1);
      width: 1.1em; height: 1.1em;
      display: inline-flex; align-items: center; justify-content: center;
      border-radius: 999px;
    }
    .ui-chip-remove:hover { background: var(--color-gray-200); color: var(--color-black); }
  `],
})
export class ChipComponent {
  @Input() selected = false;
  @Input() selectable = false;
  @Input() removable = false;
  @Input() dotColor?: string;

  @Output() selectedChange = new EventEmitter<boolean>();
  @Output() remove = new EventEmitter<void>();

  onClick() {
    if (!this.selectable) return;
    this.selected = !this.selected;
    this.selectedChange.emit(this.selected);
  }

  onRemove(event: Event) {
    event.stopPropagation();
    this.remove.emit();
  }
}
