import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ui-input-wrapper" [class.ui-input-disabled]="disabled">
      <input
        class="ui-input"
        [type]="type"
        [name]="name"
        [placeholder]="placeholder"
        [value]="value"
        [disabled]="disabled"
        (input)="onInput($event)"
        (blur)="onBlur()"
      >
    </div>
  `,
  styles: [`
    .ui-input-wrapper {
      display: inline-flex;
      width: 100%;
    }
    .ui-input {
      width: 100%;
      box-sizing: border-box;
      font-size: var(--font-size-sm);
      padding: var(--space-2) var(--space-3);
      border: var(--border-width-thin) solid var(--color-gray-300);
      border-radius: var(--radius-md, 6px);
      background: var(--color-white);
      color: var(--color-gray-900, #111);
      transition: border-color var(--motion-duration-fast) var(--motion-ease-standard),
                  box-shadow var(--motion-duration-fast) var(--motion-ease-standard);
    }
    .ui-input::placeholder {
      color: var(--color-gray-400, #999);
    }
    .ui-input:hover:not(:disabled) {
      border-color: var(--color-gray-400, #999);
    }
    .ui-input:focus {
      outline: none;
      border-color: var(--color-primary-500);
      box-shadow: var(--shadow-focus);
    }
    .ui-input-disabled .ui-input,
    .ui-input:disabled {
      background: var(--color-gray-100, #f5f5f5);
      color: var(--color-gray-400, #999);
      cursor: not-allowed;
    }
  `],
})
export class InputComponent {
  @Input() name = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' = 'text';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blurred = new EventEmitter<void>();

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.valueChange.emit(this.value);
  }

  onBlur() {
    this.blurred.emit();
  }
}