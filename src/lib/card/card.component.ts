import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'flat' | 'bordered' | 'elevated';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ui-card" [ngClass]="'ui-card-' + variant" [class.ui-card-clickable]="clickable">
      <div class="ui-card-media" *ngIf="hasMedia">
        <ng-content select="[media]"></ng-content>
      </div>

      <div class="ui-card-body">
        <div class="ui-card-header" *ngIf="title || hasHeaderSlot">
          <div class="ui-card-heading">
            <h3 *ngIf="title">{{ title }}</h3>
            <p *ngIf="subtitle" class="ui-card-subtitle">{{ subtitle }}</p>
          </div>
          <div class="ui-card-header-actions">
            <ng-content select="[header-actions]"></ng-content>
          </div>
        </div>

        <div class="ui-card-content">
          <ng-content></ng-content>
        </div>

        <div class="ui-card-footer" *ngIf="hasFooterSlot">
          <ng-content select="[footer]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ui-card {
      background: var(--color-white);
      border-radius: var(--radius-lg);
      overflow: hidden;
      transition: box-shadow var(--motion-duration-base) var(--motion-ease-standard),
                  border-color var(--motion-duration-base) var(--motion-ease-standard),
                  transform var(--motion-duration-fast) var(--motion-ease-standard);
    }

    .ui-card-flat { border: var(--border-width-thin) solid transparent; }
    .ui-card-bordered { border: var(--border-width-thin) solid var(--color-gray-200); }
    .ui-card-elevated { border: var(--border-width-thin) solid var(--color-gray-200); box-shadow: var(--shadow-sm); }

    .ui-card-clickable { cursor: pointer; }
    .ui-card-clickable:hover { box-shadow: var(--shadow-md); }
    .ui-card-clickable:active { transform: translateY(1px); }

    .ui-card-media ::ng-deep img {
      display: block;
      width: 100%;
      height: auto;
    }

    .ui-card-body { padding: var(--space-5); }

    .ui-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
    }

    .ui-card-heading h3 {
      font-family: var(--font-family-display);
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      color: var(--color-black);
      margin: 0;
    }

    .ui-card-subtitle {
      font-size: var(--font-size-sm);
      color: var(--color-gray-500);
      margin: var(--space-1) 0 0 0;
    }

    .ui-card-content {
      font-size: var(--font-size-sm);
      color: var(--color-gray-700);
      line-height: 1.5;
    }

    .ui-card-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--space-3);
      margin-top: var(--space-5);
      padding-top: var(--space-4);
      border-top: var(--border-width-thin) solid var(--color-gray-100);
    }
  `],
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() variant: CardVariant = 'bordered';
  @Input() clickable = false;

  // Content-projection slots are always rendered in the DOM (Angular can't
  // easily detect "is anything projected here"), so these flags default to
  // true. Set them to false via input if you never use header-actions/footer
  // and want to skip the extra wrapper markup.
  @Input() hasMedia = false;
  @Input() hasHeaderSlot = true;
  @Input() hasFooterSlot = true;
}
