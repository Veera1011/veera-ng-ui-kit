import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="ui-toggle">
      <input
        type="checkbox"
        [checked]="checked"
        [disabled]="disabled"
        (change)="onChange($event)"
        (blur)="onTouched()"
      >
      <span class="ui-toggle-track"><span class="ui-toggle-thumb"></span></span>
      <ng-content></ng-content>
    </label>
  `,
  styles: [`
    .ui-toggle { display: inline-flex; align-items: center; gap: var(--space-3); cursor: pointer; font-size: var(--font-size-sm); user-select: none; }
    .ui-toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
    .ui-toggle-track {
      width: 40px; height: 24px; border-radius: 999px;
      background: var(--color-gray-200);
      position: relative;
      transition: background var(--motion-duration-base) var(--motion-ease-standard);
      flex-shrink: 0;
    }
    .ui-toggle-thumb {
      position: absolute; top: 2px; left: 2px;
      width: 20px; height: 20px; border-radius: 999px;
      background: var(--color-white);
      box-shadow: var(--shadow-xs);
      transition: transform var(--motion-duration-base) var(--motion-ease-standard);
    }
    .ui-toggle input:checked ~ .ui-toggle-track { background: var(--color-primary-500); }
    .ui-toggle input:checked ~ .ui-toggle-track .ui-toggle-thumb { transform: translateX(16px); }
    .ui-toggle input:focus-visible ~ .ui-toggle-track { box-shadow: var(--shadow-focus); }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleComponent),
    multi: true,
  }],
})
export class ToggleComponent implements ControlValueAccessor {
  @Input() checked = false;
  @Input() disabled = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  private onChangeFn: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  onChange(event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    this.checked = value;
    this.checkedChange.emit(value);
    this.onChangeFn(value);
  }

  writeValue(value: boolean): void { this.checked = !!value; }
  registerOnChange(fn: (value: boolean) => void): void { this.onChangeFn = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }
}
