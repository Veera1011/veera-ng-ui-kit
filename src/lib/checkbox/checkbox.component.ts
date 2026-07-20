import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-checkbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="ui-checkbox">
      <input
        type="checkbox"
        [checked]="checked"
        [disabled]="disabled"
        (change)="onChange($event)"
        (blur)="onTouched()"
      >
      <span class="ui-checkbox-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
      </span>
      <ng-content></ng-content>
    </label>
  `,
  styles: [`
    .ui-checkbox { display: inline-flex; align-items: center; gap: var(--space-2); cursor: pointer; font-size: var(--font-size-sm); user-select: none; }
    .ui-checkbox input { position: absolute; opacity: 0; width: 0; height: 0; }
    .ui-checkbox-box {
      width: 18px; height: 18px; border-radius: var(--radius-sm);
      border: var(--border-width-thin) solid var(--color-gray-300);
      background: var(--color-white);
      display: inline-flex; align-items: center; justify-content: center;
      transition: background var(--motion-duration-fast) var(--motion-ease-standard), border-color var(--motion-duration-fast) var(--motion-ease-standard);
      flex-shrink: 0;
    }
    .ui-checkbox-box svg { width: 12px; height: 12px; opacity: 0; transition: opacity var(--motion-duration-fast) var(--motion-ease-standard); }
    .ui-checkbox input:checked + .ui-checkbox-box { background: var(--color-primary-500); border-color: var(--color-primary-500); }
    .ui-checkbox input:checked + .ui-checkbox-box svg { opacity: 1; }
    .ui-checkbox input:focus-visible + .ui-checkbox-box { box-shadow: var(--shadow-focus); }
    .ui-checkbox input:disabled + .ui-checkbox-box { opacity: 0.4; }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true,
  }],
})
export class CheckboxComponent implements ControlValueAccessor {
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
