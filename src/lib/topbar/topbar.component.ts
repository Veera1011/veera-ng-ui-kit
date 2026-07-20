import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TopbarNavItem {
  id: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'ui-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="ui-topbar" [class.ui-topbar-sticky]="sticky" [class.ui-topbar-bordered]="bordered">
      <div class="ui-topbar-row">

        <div class="ui-topbar-brand">
          <ng-content select="[brand]"></ng-content>
        </div>

        <nav class="ui-topbar-nav" *ngIf="navItems.length">
          <button
            *ngFor="let item of navItems"
            type="button"
            class="ui-topbar-nav-item"
            [class.ui-topbar-nav-item-active]="item.id === activeId"
            (click)="onNavClick(item)"
          >
            {{ item.label }}
          </button>
        </nav>

        <div class="ui-topbar-search" *ngIf="hasSearch">
          <ng-content select="[search]"></ng-content>
        </div>

        <div class="ui-topbar-spacer"></div>

        <div class="ui-topbar-actions">
          <ng-content select="[actions]"></ng-content>
        </div>

        <button
          type="button"
          class="ui-topbar-toggle"
          (click)="mobileOpen = !mobileOpen"
          [attr.aria-expanded]="mobileOpen"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path *ngIf="!mobileOpen" d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path *ngIf="mobileOpen" d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="ui-topbar-mobile" [class.ui-topbar-mobile-open]="mobileOpen">
        <nav class="ui-topbar-mobile-nav" *ngIf="navItems.length">
          <button
            *ngFor="let item of navItems"
            type="button"
            class="ui-topbar-mobile-nav-item"
            [class.ui-topbar-nav-item-active]="item.id === activeId"
            (click)="onNavClick(item); mobileOpen = false"
          >
            {{ item.label }}
          </button>
        </nav>
        <div class="ui-topbar-mobile-search" *ngIf="hasSearch">
          <ng-content select="[search]"></ng-content>
        </div>
        <div class="ui-topbar-mobile-actions">
          <ng-content select="[actions]"></ng-content>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .ui-topbar {
      width: 100%;
      background: var(--color-white);
      z-index: 100;
    }
    .ui-topbar-sticky { position: sticky; top: 0; }
    .ui-topbar-bordered { border-bottom: var(--border-width-thin) solid var(--color-gray-200, #e8e8e8); }

    .ui-topbar-row {
      display: flex;
      align-items: center;
      gap: var(--space-5, 20px);
      padding: var(--space-3, 12px) var(--space-6, 24px);
      height: 64px;
      box-sizing: border-box;
    }

    .ui-topbar-brand {
      display: flex;
      align-items: center;
      font-weight: 700;
      font-size: var(--font-size-md, 16px);
      color: var(--color-gray-900, #111);
      flex-shrink: 0;
    }

    .ui-topbar-nav {
      display: flex;
      align-items: center;
      gap: var(--space-1, 4px);
    }
    .ui-topbar-nav-item {
      border: none;
      background: none;
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: var(--color-gray-500, #666);
      padding: var(--space-2, 8px) var(--space-3, 12px);
      border-radius: var(--radius-md, 8px);
      cursor: pointer;
      transition: background 150ms var(--motion-ease-standard), color 150ms var(--motion-ease-standard);
      white-space: nowrap;
    }
    .ui-topbar-nav-item:hover { background: var(--color-gray-50, #fafafa); color: var(--color-gray-900, #111); }
    .ui-topbar-nav-item-active { color: var(--color-primary-500); background: var(--color-primary-50, #eef4ff); }

    .ui-topbar-search {
      max-width: 320px;
      flex: 1;
    }

    .ui-topbar-spacer { flex: 1; }

    .ui-topbar-actions {
      display: flex;
      align-items: center;
      gap: var(--space-3, 12px);
      flex-shrink: 0;
    }

    .ui-topbar-toggle {
      display: none;
      align-items: center;
      justify-content: center;
      width: 36px; height: 36px;
      border: none;
      border-radius: var(--radius-md, 8px);
      background: transparent;
      color: var(--color-gray-700, #333);
      cursor: pointer;
      flex-shrink: 0;
    }
    .ui-topbar-toggle:hover { background: var(--color-gray-100, #f5f5f5); }

    .ui-topbar-mobile {
      display: none;
      flex-direction: column;
      gap: var(--space-4, 16px);
      padding: 0 var(--space-6, 24px);
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: max-height 260ms var(--motion-ease-standard),
                  opacity 200ms var(--motion-ease-standard),
                  padding 260ms var(--motion-ease-standard);
      border-top: var(--border-width-thin) solid transparent;
    }
    .ui-topbar-mobile-open {
      max-height: 480px;
      opacity: 1;
      padding: var(--space-4, 16px) var(--space-6, 24px) var(--space-5, 20px);
      border-top-color: var(--color-gray-100, #f0f0f0);
    }
    .ui-topbar-mobile-nav {
      display: flex;
      flex-direction: column;
      gap: var(--space-1, 4px);
    }
    .ui-topbar-mobile-nav-item {
      text-align: left;
      border: none;
      background: none;
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: var(--color-gray-600, #555);
      padding: var(--space-3, 12px);
      border-radius: var(--radius-md, 8px);
      cursor: pointer;
    }
    .ui-topbar-mobile-nav-item:hover { background: var(--color-gray-50, #fafafa); }
    .ui-topbar-mobile-actions {
      display: flex;
      align-items: center;
      gap: var(--space-3, 12px);
    }

    /* Responsive breakpoint */
    @media (max-width: 860px) {
      .ui-topbar-nav, .ui-topbar-search, .ui-topbar-actions { display: none; }
      .ui-topbar-toggle { display: inline-flex; }
      .ui-topbar-mobile { display: flex; }
    }
  `],
})
export class TopbarComponent {
  @Input() navItems: TopbarNavItem[] = [];
  @Input() activeId = '';
  @Input() sticky = true;
  @Input() bordered = true;
  @Input() hasSearch = false;

  @Output() activeIdChange = new EventEmitter<string>();

  mobileOpen = false;

  onNavClick(item: TopbarNavItem) {
    this.activeIdChange.emit(item.id);
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 860) this.mobileOpen = false;
  }
}