import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-radio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="ui-radio">
      <input
        type="radio"
        [name]="name"
        [value]="value"
        [checked]="checked"
        [disabled]="disabled"
        (change)="onChange()"
      >
      <span class="ui-radio-dot"></span>
      <ng-content></ng-content>
    </label>
  `,
  styles: [`
    .ui-radio { display: inline-flex; align-items: center; gap: var(--space-2); cursor: pointer; font-size: var(--font-size-sm); user-select: none; }
    .ui-radio input { position: absolute; opacity: 0; width: 0; height: 0; }
    .ui-radio-dot {
      width: 18px; height: 18px; border-radius: 999px;
      border: var(--border-width-thin) solid var(--color-gray-300);
      background: var(--color-white);
      display: inline-flex; align-items: center; justify-content: center;
      transition: border-color var(--motion-duration-fast) var(--motion-ease-standard);
      flex-shrink: 0;
    }
    .ui-radio-dot::after {
      content: ""; width: 8px; height: 8px; border-radius: 999px;
      background: var(--color-primary-500);
      transform: scale(0);
      transition: transform var(--motion-duration-fast) var(--motion-ease-standard);
    }
    .ui-radio input:checked + .ui-radio-dot { border-color: var(--color-primary-500); }
    .ui-radio input:checked + .ui-radio-dot::after { transform: scale(1); }
    .ui-radio input:focus-visible + .ui-radio-dot { box-shadow: var(--shadow-focus); }
  `],
})
export class RadioComponent {
  @Input() name = '';
  @Input() value = '';
  @Input() checked = false;
  @Input() disabled = false;
  @Output() checkedChange = new EventEmitter<string>();

  onChange() {
    this.checkedChange.emit(this.value);
  }
}
