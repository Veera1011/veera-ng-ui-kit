import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BannerVariant = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

@Component({
  selector: 'ui-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="ui-banner"
      [class]="'ui-banner-' + variant"
      *ngIf="visible"
      role="status"
    >
      <div class="ui-banner-content">
        <span class="ui-banner-icon" *ngIf="icon">
          <ng-content select="[icon]"></ng-content>
          <ng-container *ngIf="!hasProjectedIcon">{{ defaultIcon() }}</ng-container>
        </span>

        <span class="ui-banner-text">
          <ng-content></ng-content>
        </span>

        <button
          type="button"
          *ngIf="actionLabel"
          class="ui-banner-action"
          (click)="actionClick.emit()"
        >
          {{ actionLabel }}
        </button>
      </div>

      <button
        type="button"
        class="ui-banner-close"
        *ngIf="dismissible"
        (click)="dismiss()"
        aria-label="Dismiss"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .ui-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4, 16px);
      width: 100%;
      padding: var(--space-3, 12px) var(--space-5, 20px);
      box-sizing: border-box;
      font-size: var(--font-size-sm);
      font-weight: 500;
    }

    .ui-banner-content {
      display: flex;
      align-items: center;
      gap: var(--space-3, 12px);
      flex-wrap: wrap;
      min-width: 0;
    }

    .ui-banner-icon {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      font-size: 16px;
    }

    .ui-banner-text {
      line-height: 1.4;
    }

    .ui-banner-action {
      font-weight: 700;
      text-decoration: underline;
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
      background: none;
      border: none;
      padding: 0;
      color: inherit;
      font-size: inherit;
      font-family: inherit;
    }

    .ui-banner-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px; height: 24px;
      border: none;
      border-radius: 999px;
      background: transparent;
      cursor: pointer;
      flex-shrink: 0;
      opacity: 0.7;
      color: inherit;
      transition: opacity 150ms var(--motion-ease-standard), background 150ms var(--motion-ease-standard);
    }
    .ui-banner-close:hover { opacity: 1; background: rgba(0,0,0,0.06); }

    /* Variants — solid, high-visibility backgrounds since this sits above all page content */
    .ui-banner-info {
      background: var(--color-primary-500);
      color: var(--color-white);
    }
    .ui-banner-success {
      background: var(--color-semantic-success, #1e9e5a);
      color: var(--color-white);
    }
    .ui-banner-warning {
      background: var(--color-semantic-warning, #d99a1b);
      color: var(--color-white);
    }
    .ui-banner-danger {
      background: var(--color-semantic-danger, #dd3333);
      color: var(--color-white);
    }
    .ui-banner-neutral {
      background: var(--color-gray-900, #111);
      color: var(--color-white);
    }
  `],
})
export class BannerComponent {
  @Input() variant: BannerVariant = 'info';
  @Input() icon = true;
  @Input() dismissible = true;
  @Input() actionLabel = '';
  @Input() visible = true;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() actionClick = new EventEmitter<void>();

  hasProjectedIcon = false;

  dismiss() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  defaultIcon(): string {
    switch (this.variant) {
      case 'success': return '✓';
      case 'warning': return '!';
      case 'danger': return '✕';
      case 'neutral': return 'ⓘ';
      default: return 'ⓘ';
    }
  }
}