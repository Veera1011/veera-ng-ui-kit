import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  date: Date;
  label: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  disabled: boolean;
}

@Component({
  selector: 'ui-date-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ui-dp" [class.ui-dp-disabled]="disabled">
      <button
        #trigger
        type="button"
        class="ui-dp-trigger"
        [disabled]="disabled"
        (click)="toggle()"
      >
        <span [class.ui-dp-placeholder]="!value">{{ displayLabel() }}</span>
        <svg class="ui-dp-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.6"/>
          <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </button>

      <div
        class="ui-dp-panel"
        *ngIf="open"
        [style.top.px]="panelTop"
        [style.left.px]="panelLeft"
      >
        <div class="ui-dp-header">
          <button type="button" class="ui-dp-nav" (click)="shiftMonth(-1)" aria-label="Previous month">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <span class="ui-dp-month-label">{{ monthLabel() }}</span>
          <button type="button" class="ui-dp-nav" (click)="shiftMonth(1)" aria-label="Next month">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>

        <div class="ui-dp-weekdays">
          <span *ngFor="let d of weekdays">{{ d }}</span>
        </div>

        <div class="ui-dp-grid">
          <button
            *ngFor="let day of days"
            type="button"
            class="ui-dp-day"
            [class.ui-dp-day-muted]="!day.inCurrentMonth"
            [class.ui-dp-day-today]="day.isToday"
            [class.ui-dp-day-selected]="day.isSelected"
            [disabled]="day.disabled"
            (click)="select(day)"
          >
            {{ day.label }}
          </button>
        </div>

        <div class="ui-dp-footer">
          <button type="button" class="ui-dp-link" (click)="clear()">Clear</button>
          <button type="button" class="ui-dp-link ui-dp-link-accent" (click)="goToday()">Today</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ui-dp { position: relative; display: inline-block; width: 100%; }

    .ui-dp-trigger {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-2);
      font-size: var(--font-size-sm);
      font-family: inherit;
      padding: var(--space-2) var(--space-3);
      border: var(--border-width-thin) solid var(--color-gray-300);
      border-radius: var(--radius-md, 10px);
      background: var(--color-white);
      color: var(--color-gray-900, #111);
      cursor: pointer;
      transition: border-color var(--motion-duration-fast) var(--motion-ease-standard),
                  box-shadow var(--motion-duration-fast) var(--motion-ease-standard);
    }
    .ui-dp-trigger:hover:not(:disabled) { border-color: var(--color-gray-400, #999); }
    .ui-dp-trigger:focus-visible { outline: none; border-color: var(--color-primary-500); box-shadow: var(--shadow-focus); }
    .ui-dp-trigger:disabled { background: var(--color-gray-100, #f5f5f5); color: var(--color-gray-400, #999); cursor: not-allowed; }
    .ui-dp-placeholder { color: var(--color-gray-400, #999); }
    .ui-dp-icon { color: var(--color-gray-400, #999); flex-shrink: 0; }

    /* KEY CHANGE: fixed instead of absolute, positioned via JS-computed top/left,
       and a very high z-index so nothing in the app can paint over it. */
    .ui-dp-panel {
      position: fixed;
      z-index: var(--z-index-popover, 9999);
      width: 280px;
      background: var(--color-white);
      border: var(--border-width-thin) solid var(--color-gray-200, #e5e5e5);
      border-radius: var(--radius-lg, 14px);
      box-shadow: var(--shadow-md, 0 8px 24px rgba(0,0,0,0.12));
      padding: var(--space-4, 16px);
      animation: ui-dp-pop 120ms var(--motion-ease-standard);
      transform-origin: top left;
    }
    @keyframes ui-dp-pop {
      from { opacity: 0; transform: scale(0.96) translateY(-4px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .ui-dp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); }
    .ui-dp-month-label { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-gray-900, #111); }
    .ui-dp-nav {
      display: inline-flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; border: none; border-radius: 999px;
      background: transparent; color: var(--color-gray-500, #666); cursor: pointer;
      transition: background var(--motion-duration-fast) var(--motion-ease-standard);
    }
    .ui-dp-nav:hover { background: var(--color-gray-100, #f5f5f5); color: var(--color-gray-900, #111); }

    .ui-dp-weekdays {
      display: grid; grid-template-columns: repeat(7, 1fr);
      margin-bottom: var(--space-1, 4px);
    }
    .ui-dp-weekdays span {
      text-align: center; font-size: var(--font-size-xs, 11px); font-weight: 600;
      color: var(--color-gray-400, #999); text-transform: uppercase; letter-spacing: 0.02em;
      padding-bottom: var(--space-2);
    }

    .ui-dp-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }

    .ui-dp-day {
      aspect-ratio: 1; width: 100%; border: none; background: transparent;
      border-radius: 999px; font-size: var(--font-size-sm); color: var(--color-gray-900, #111);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: background var(--motion-duration-fast) var(--motion-ease-standard),
                  color var(--motion-duration-fast) var(--motion-ease-standard);
    }
    .ui-dp-day:hover:not(:disabled):not(.ui-dp-day-selected) { background: var(--color-gray-100, #f5f5f5); }
    .ui-dp-day-muted { color: var(--color-gray-300, #ccc); }
    .ui-dp-day-today { box-shadow: inset 0 0 0 1.5px var(--color-primary-500); font-weight: 600; }
    .ui-dp-day-selected { background: var(--color-primary-500); color: var(--color-white); font-weight: 600; }
    .ui-dp-day:disabled { color: var(--color-gray-200, #e0e0e0); cursor: not-allowed; }

    .ui-dp-footer {
      display: flex; align-items: center; justify-content: space-between;
      margin-top: var(--space-3); padding-top: var(--space-3);
      border-top: var(--border-width-thin) solid var(--color-gray-100, #f0f0f0);
    }
    .ui-dp-link {
      border: none; background: none; font-size: var(--font-size-sm);
      color: var(--color-gray-500, #666); cursor: pointer; padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-sm, 6px);
    }
    .ui-dp-link:hover { background: var(--color-gray-100, #f5f5f5); }
    .ui-dp-link-accent { color: var(--color-primary-500); font-weight: 600; }
  `],
})
export class DatePickerComponent {
  @Input() name = '';
  @Input() value = '';
  @Input() min = '';
  @Input() max = '';
  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blurred = new EventEmitter<void>();

  @ViewChild('trigger') triggerRef!: ElementRef<HTMLButtonElement>;

  weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  open = false;
  viewDate = new Date();
  days: CalendarDay[] = [];
  panelTop = 0;
  panelLeft = 0;

  constructor(private el: ElementRef) {
    if (this.value) this.viewDate = this.parseDate(this.value);
    this.buildGrid();
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    if (this.open && !this.el.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  @HostListener('window:scroll', ['$event'])
  @HostListener('window:resize')
  onViewportChange() {
    if (this.open) this.updatePosition();
  }

  toggle() {
    if (this.disabled) return;
    this.open ? this.close() : this.openPanel();
  }

  private openPanel() {
    this.viewDate = this.value ? this.parseDate(this.value) : new Date();
    this.buildGrid();
    this.open = true;
    // wait a tick so the panel exists in the DOM before measuring/positioning it
    setTimeout(() => this.updatePosition());
  }

  private close() {
    this.open = false;
    this.blurred.emit();
  }

  private updatePosition() {
    const rect = this.triggerRef?.nativeElement.getBoundingClientRect();
    if (!rect) return;

    const panelWidth = 280;
    const panelHeight = 360; // approx, used only to flip above if no room below
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceRight = window.innerWidth - rect.left;

    this.panelTop = spaceBelow < panelHeight && rect.top > panelHeight
      ? rect.top - panelHeight - 8   // flip above the trigger
      : rect.bottom + 8;             // default: below the trigger

    this.panelLeft = spaceRight < panelWidth
      ? Math.max(8, rect.right - panelWidth)  // align to right edge if not enough room
      : rect.left;
  }

  shiftMonth(delta: number) {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + delta, 1);
    this.buildGrid();
  }

  select(day: CalendarDay) {
    if (day.disabled) return;
    this.value = this.formatDate(day.date);
    this.valueChange.emit(this.value);
    this.close();
  }

  clear() {
    this.value = '';
    this.valueChange.emit(this.value);
  }

  goToday() {
    const today = new Date();
    this.value = this.formatDate(today);
    this.viewDate = today;
    this.valueChange.emit(this.value);
    this.buildGrid();
    this.close();
  }

  monthLabel(): string {
    return this.viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  displayLabel(): string {
    if (!this.value) return 'Select date';
    return this.parseDate(this.value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  private buildGrid() {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);

    const today = this.formatDate(new Date());
    const selected = this.value;
    const minDate = this.min ? this.parseDate(this.min) : null;
    const maxDate = this.max ? this.parseDate(this.max) : null;

    this.days = Array.from({ length: 42 }, (_, i) => {
      const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      const iso = this.formatDate(date);
      const disabled = (!!minDate && date < minDate) || (!!maxDate && date > maxDate);
      return {
        date,
        label: date.getDate(),
        inCurrentMonth: date.getMonth() === month,
        isToday: iso === today,
        isSelected: iso === selected,
        disabled,
      };
    });
  }

  private formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private parseDate(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
}