import {
  Component, ElementRef, EventEmitter, HostListener, Input,
  OnChanges, OnDestroy, Output, SimpleChanges, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

@Component({
  selector: 'ui-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ui-drawer-root" *ngIf="mounted">
      <div
        class="ui-drawer-backdrop"
        [class.ui-drawer-backdrop-visible]="visible"
        (click)="onBackdropClick()"
      ></div>

      <div
        #panel
        class="ui-drawer-panel"
        [class]="'ui-drawer-panel-' + position + ' ui-drawer-size-' + size"
        [class.ui-drawer-panel-visible]="visible"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="title || 'Drawer'"
        tabindex="-1"
      >
        <div class="ui-drawer-handle" *ngIf="position === 'bottom' && size !== 'full'"></div>

        <div class="ui-drawer-header" *ngIf="title" [class.ui-drawer-header-elevated]="scrolled">
          <h2 class="ui-drawer-title">{{ title }}</h2>
          <button type="button" class="ui-drawer-close" (click)="close()" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="ui-drawer-body" (scroll)="onBodyScroll($event)">
          <ng-content></ng-content>
        </div>

        <div class="ui-drawer-footer" *ngIf="hasActions" [class.ui-drawer-footer-elevated]="scrolled">
          <ng-content select="[actions]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ui-drawer-root { position: fixed; inset: 0; z-index: 1000; }

    .ui-drawer-backdrop {
      position: absolute; inset: 0;
      background: rgba(15, 15, 20, 0.4);
      backdrop-filter: blur(0px);
      -webkit-backdrop-filter: blur(0px);
      opacity: 0;
      transition: opacity 260ms var(--motion-ease-standard),
                  backdrop-filter 260ms var(--motion-ease-standard),
                  -webkit-backdrop-filter 260ms var(--motion-ease-standard);
    }
    .ui-drawer-backdrop-visible {
      opacity: 1;
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
    }

    .ui-drawer-panel {
      position: absolute;
      display: flex;
      flex-direction: column;
      background: var(--color-white);
      box-shadow: var(--shadow-lg, 0 20px 60px rgba(0,0,0,0.22));
      transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
                  opacity 200ms var(--motion-ease-standard);
      opacity: 0;
    }
    .ui-drawer-panel-visible { opacity: 1; }

    /* Right */
    .ui-drawer-panel-right {
      top: 0; right: 0; height: 100%;
      border-left: var(--border-width-thin) solid var(--color-gray-200, #e8e8e8);
      border-radius: var(--radius-xl, 18px) 0 0 var(--radius-xl, 18px);
      transform: translateX(102%) scale(0.98);
    }
    .ui-drawer-panel-right.ui-drawer-panel-visible { transform: translateX(0) scale(1); }

    /* Left */
    .ui-drawer-panel-left {
      top: 0; left: 0; height: 100%;
      border-right: var(--border-width-thin) solid var(--color-gray-200, #e8e8e8);
      border-radius: 0 var(--radius-xl, 18px) var(--radius-xl, 18px) 0;
      transform: translateX(-102%) scale(0.98);
    }
    .ui-drawer-panel-left.ui-drawer-panel-visible { transform: translateX(0) scale(1); }

    /* Top */
    .ui-drawer-panel-top {
      top: 0; left: 0; width: 100%;
      border-bottom: var(--border-width-thin) solid var(--color-gray-200, #e8e8e8);
      border-radius: 0 0 var(--radius-xl, 18px) var(--radius-xl, 18px);
      transform: translateY(-102%) scale(0.98);
    }
    .ui-drawer-panel-top.ui-drawer-panel-visible { transform: translateY(0) scale(1); }

    /* Bottom */
    .ui-drawer-panel-bottom {
      bottom: 0; left: 0; width: 100%;
      border-top: var(--border-width-thin) solid var(--color-gray-200, #e8e8e8);
      border-radius: var(--radius-xl, 18px) var(--radius-xl, 18px) 0 0;
      transform: translateY(102%) scale(0.98);
    }
    .ui-drawer-panel-bottom.ui-drawer-panel-visible { transform: translateY(0) scale(1); }

    /* Full — no rounding, no scale, edge to edge */
    .ui-drawer-size-full { border-radius: 0 !important; }
    .ui-drawer-panel-left.ui-drawer-size-full,
    .ui-drawer-panel-right.ui-drawer-size-full { width: 100vw; }
    .ui-drawer-panel-top.ui-drawer-size-full,
    .ui-drawer-panel-bottom.ui-drawer-size-full { height: 100vh; }

    /* Sizes — width for left/right, height for top/bottom, responsive via clamp */
    .ui-drawer-panel-left.ui-drawer-size-sm, .ui-drawer-panel-right.ui-drawer-size-sm { width: clamp(280px, 90vw, 320px); }
    .ui-drawer-panel-left.ui-drawer-size-md, .ui-drawer-panel-right.ui-drawer-size-md { width: clamp(320px, 90vw, 420px); }
    .ui-drawer-panel-left.ui-drawer-size-lg, .ui-drawer-panel-right.ui-drawer-size-lg { width: clamp(360px, 90vw, 560px); }

    .ui-drawer-panel-top.ui-drawer-size-sm, .ui-drawer-panel-bottom.ui-drawer-size-sm { height: clamp(200px, 70vh, 240px); }
    .ui-drawer-panel-top.ui-drawer-size-md, .ui-drawer-panel-bottom.ui-drawer-size-md { height: clamp(280px, 70vh, 360px); }
    .ui-drawer-panel-top.ui-drawer-size-lg, .ui-drawer-panel-bottom.ui-drawer-size-lg { height: clamp(360px, 80vh, 520px); }

    @media (max-width: 480px) {
      .ui-drawer-panel-left, .ui-drawer-panel-right { width: 100vw !important; border-radius: 0 !important; }
    }

    /* Bottom-sheet drag handle — purely visual affordance */
    .ui-drawer-handle {
      display: flex; justify-content: center;
      padding: var(--space-2, 8px) 0 var(--space-1, 4px);
      flex-shrink: 0;
    }
    .ui-drawer-handle::after {
      content: "";
      width: 36px; height: 4px;
      border-radius: 999px;
      background: var(--color-gray-200, #e0e0e0);
    }

    .ui-drawer-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: var(--space-4, 16px) var(--space-5, 20px);
      border-bottom: 1px solid transparent;
      flex-shrink: 0;
      transition: border-color 180ms var(--motion-ease-standard), box-shadow 180ms var(--motion-ease-standard);
    }
    .ui-drawer-header-elevated {
      border-bottom-color: var(--color-gray-100, #f0f0f0);
      box-shadow: 0 4px 12px -8px rgba(0,0,0,0.15);
    }
    .ui-drawer-title {
      font-family: var(--font-family-display, inherit);
      font-size: var(--font-size-md, 17px);
      font-weight: 600;
      color: var(--color-gray-900, #111);
      margin: 0;
    }
    .ui-drawer-close {
      display: inline-flex; align-items: center; justify-content: center;
      width: 30px; height: 30px; border: none; border-radius: 999px;
      background: transparent; color: var(--color-gray-400, #999); cursor: pointer;
      transition: background 150ms var(--motion-ease-standard),
                  color 150ms var(--motion-ease-standard),
                  transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .ui-drawer-close:hover {
      background: var(--color-gray-100, #f5f5f5);
      color: var(--color-gray-900, #111);
      transform: rotate(90deg);
    }

    .ui-drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-5, 20px);
      font-size: var(--font-size-sm);
      color: var(--color-gray-700, #333);
    }

    .ui-drawer-footer {
      display: flex; align-items: center; justify-content: flex-end; gap: var(--space-3);
      padding: var(--space-4, 16px) var(--space-5, 20px);
      border-top: 1px solid transparent;
      flex-shrink: 0;
      transition: border-color 180ms var(--motion-ease-standard), box-shadow 180ms var(--motion-ease-standard);
    }
    .ui-drawer-footer-elevated {
      border-top-color: var(--color-gray-100, #f0f0f0);
      box-shadow: 0 -4px 12px -8px rgba(0,0,0,0.15);
    }
  `],
})
export class DrawerComponent implements OnChanges, OnDestroy {
  @Input() open = false;
  @Input() title = '';
  @Input() position: DrawerPosition = 'right';
  @Input() size: DrawerSize = 'md';
  @Input() closeOnBackdrop = true;
  @Input() closeOnEscape = true;
  @Input() hasActions = false;

  @Output() openChange = new EventEmitter<boolean>();

  @ViewChild('panel') panelRef?: ElementRef<HTMLDivElement>;

  mounted = false;
  visible = false;
  scrolled = false;
  private timer: any;
  private previouslyFocused: HTMLElement | null = null;

  ngOnChanges(changes: SimpleChanges) {
    // Only react when the `open` input itself changes — not on every
    // title/position/size/etc. change, which was re-triggering the
    // mount/animation sequence unnecessarily.
    if (!changes['open']) return;

    clearTimeout(this.timer);

    if (this.open) {
      this.show();
    } else if (this.mounted) {
      this.hide();
    }
  }

  private show() {
    this.previouslyFocused = document.activeElement as HTMLElement;
    this.mounted = true;
    this.scrolled = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.visible = true;
      this.panelRef?.nativeElement.focus();
    }));
  }

  private hide() {
    this.visible = false;
    document.body.style.overflow = '';
    this.timer = setTimeout(() => {
      this.mounted = false;
      this.previouslyFocused?.focus?.();
    }, 320);
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.open && this.closeOnEscape) this.close();
  }

  @HostListener('document:keydown.tab', ['$event'])
  onTab(event: KeyboardEvent) {
    if (!this.open || !this.panelRef) return;
    const focusables = this.panelRef.nativeElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  onBodyScroll(event: Event) {
    this.scrolled = (event.target as HTMLElement).scrollTop > 4;
  }

  onBackdropClick() {
    if (this.closeOnBackdrop) this.close();
  }

  close() {
    if (!this.open) return;

    // Drive the close animation ourselves — don't rely on the parent
    // round-tripping the new value back into [open]. This is what makes
    // the X button / backdrop / Escape work even if the consumer only
    // has [open] bound one-way (no (openChange) listener at all).
    this.open = false;
    this.hide();
    this.openChange.emit(false);
  }
}