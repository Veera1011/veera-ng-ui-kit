import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="ui-btn"
      [ngClass]="['ui-btn-' + variant, 'ui-btn-' + size, iconOnly ? 'ui-btn-icon' : '']"
      [disabled]="disabled"
      [attr.type]="type"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .ui-btn {
      font-family: var(--font-family-body);
      font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-md);
      border: var(--border-width-thin) solid transparent;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      transition: background var(--motion-duration-base) var(--motion-ease-standard),
                  border-color var(--motion-duration-base) var(--motion-ease-standard),
                  box-shadow var(--motion-duration-base) var(--motion-ease-standard),
                  transform var(--motion-duration-fast) var(--motion-ease-standard);
    }
    .ui-btn:active { transform: translateY(1px); }
    .ui-btn:focus-visible { outline: none; box-shadow: var(--shadow-focus); }
    .ui-btn:disabled { opacity: 0.45; cursor: not-allowed; }

    .ui-btn-sm { font-size: var(--font-size-xs); padding: var(--space-2) var(--space-4); }
    .ui-btn-md { font-size: var(--font-size-sm); padding: var(--space-3) var(--space-5); }
    .ui-btn-lg { font-size: var(--font-size-base); padding: var(--space-4) var(--space-6); }

    .ui-btn-primary { background: var(--color-primary-500); color: var(--color-white); }
    .ui-btn-primary:hover:not(:disabled) { background: var(--color-primary-600); }
    .ui-btn-primary:active:not(:disabled) { background: var(--color-primary-700); }

    .ui-btn-secondary { background: var(--color-white); color: var(--color-black); border-color: var(--color-gray-200); }
    .ui-btn-secondary:hover:not(:disabled) { border-color: var(--color-gray-500); }

    .ui-btn-ghost { background: transparent; color: var(--color-primary-600); }
    .ui-btn-ghost:hover:not(:disabled) { background: var(--color-primary-50); }

    .ui-btn-danger { background: var(--color-semantic-danger); color: var(--color-white); }
    .ui-btn-danger:hover:not(:disabled) { filter: brightness(0.92); }

    .ui-btn-icon { width: 2.25rem; height: 2.25rem; padding: 0; justify-content: center; border-radius: var(--radius-full); }
  `],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() iconOnly = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
}
