import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `
    <div class="ui-select" [class.disabled]="disabled">

      <button
        type="button"
        class="ui-select-trigger"
        [disabled]="disabled"
        (click)="toggle()">

        <span class="selected-text">
          {{ selectedOption?.label || placeholder }}
        </span>

        <span class="arrow" [class.open]="opened">
          ▼
        </span>
      </button>

      <div class="ui-select-panel" *ngIf="opened">

        <div class="ui-select-list">
          <div
            *ngFor="let option of options"
            class="ui-option"
            [class.selected]="option.value === value"
            (click)="select(option)">

            <span>{{ option.label }}</span>

            <span
              class="check"
              *ngIf="option.value === value">
              ✓
            </span>

          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    .ui-select {
      position: relative;
      width: 240px;
      font-family: var(--font-family-body, Inter);
    }

    .ui-select.disabled {
      opacity: .6;
      pointer-events: none;
    }

    .ui-select-trigger {
      width: 100%;
      min-height: 42px;
      padding: 10px 14px;
      border: 1px solid var(--color-gray-300, #d1d5db);
      border-radius: 10px;
      background: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all .2s ease;
      font-size: 14px;
    }

    .ui-select-trigger:hover {
      border-color: var(--color-gray-500, #6b7280);
    }

    .ui-select-trigger:focus-visible {
      outline: none;
      border-color: var(--color-primary-500, #f97316);
      box-shadow: 0 0 0 3px rgba(249,115,22,.15);
    }

    .selected-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .arrow {
      font-size: 12px;
      transition: transform .2s ease;
      color: #6b7280;
    }

    .arrow.open {
      transform: rotate(180deg);
    }

    .ui-select-panel {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      right: 0;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      box-shadow:
        0 10px 25px rgba(0,0,0,.08),
        0 4px 10px rgba(0,0,0,.04);
      z-index: 1000;
      animation: dropdown .15s ease;
    }

    /* Scrolling happens in here, not on the rounded panel itself.
       Mixing overflow-y:auto with border-radius on the same element
       is what was causing the bottom corners to render flat/clipped
       once the list had more options than fit — moving the scroll
       to this inner, non-rounded wrapper fixes it. */
    .ui-select-list {
      max-height: 250px;
      overflow-y: auto;
    }

    .ui-option {
      padding: 12px 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all .15s ease;
      font-size: 14px;
      background :var var(--color-primary-500, #f97316);
    }

    .ui-option:hover {
      background: #fff7ed;
    }

    .ui-option.selected {
      background: #ffedd5;
      color:var var(--color-primary-500, #f97316);
      font-weight: 600;
    }

    .check {
      font-size: 13px;
    }

    .ui-select-list::-webkit-scrollbar {
      width: 6px;
    }

    .ui-select-list::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 999px;
    }

    @keyframes dropdown {
      from {
        opacity: 0;
        transform: translateY(-6px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() value = '';

  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Select option';
  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<string>();

  
  opened = false;

  private onChangeFn: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get selectedOption() {
    return this.options.find(
      x => x.value === this.value
    );
  }

  toggle(): void {
    if (this.disabled) {
      return;
    }

    this.opened = !this.opened;
  }

  select(option: SelectOption): void {
    this.value = option.value;

    this.valueChange.emit(option.value);
    this.onChangeFn(option.value);
    this.onTouched();

    this.opened = false;
  }

  @HostListener('document:click')
  closeDropdown(): void {
    this.opened = false;
  }

  @HostListener('click', ['$event'])
  preventClose(event: Event): void {
    event.stopPropagation();
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}