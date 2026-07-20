import { Component, computed, input, model, signal, effect, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-time-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ui-timepicker-container">
      
      <!-- Interactive Input Trigger Box Field -->
      <div 
        class="ui-timepicker-trigger" 
        [class.is-open]="dropdownOpen()"
        [class.is-disabled]="disabled()"
        (click)="!disabled() && toggleDropdown()"
        tabindex="0"
        (keydown.enter)="!disabled() && toggleDropdown()"
        (keydown.space)="!disabled() && toggleDropdown(); $event.preventDefault()"
      >
        <span class="ui-timepicker-value">
          {{ displayValue() || placeholder() }}
        </span>
        <div class="ui-timepicker-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      </div>

      <!-- Contextual Selector Dropdown Overlay Overlay Matrix Grid -->
      <div class="ui-timepicker-dropdown" *ngIf="dropdownOpen()">
        <div class="ui-timepicker-columns">
          
          <!-- Hours Matrix Column List Section -->
          <div class="ui-timepicker-col" #hoursCol>
            <button 
              type="button"
              *ngFor="let hour of hours"
              class="ui-timepicker-opt"
              [class.is-selected]="selectedHour() === hour"
              (click)="selectHour(hour)"
            >
              {{ hour }}
            </button>
          </div>

          <!-- Minutes Matrix Column List Section -->
          <div class="ui-timepicker-col" #minutesCol>
            <button 
              type="button"
              *ngFor="let min of minutes"
              class="ui-timepicker-opt"
              [class.is-selected]="selectedMinute() === min"
              (click)="selectMinute(min)"
            >
              {{ min }}
            </button>
          </div>

          <!-- Period Markers Column Selection Module -->
          <div class="ui-timepicker-col period-col">
            <button 
              type="button"
              class="ui-timepicker-opt"
              [class.is-selected]="selectedPeriod() === 'AM'"
              (click)="selectPeriod('AM')"
            >
              AM
            </button>
            <button 
              type="button"
              class="ui-timepicker-opt"
              [class.is-selected]="selectedPeriod() === 'PM'"
              (click)="selectPeriod('PM')"
            >
              PM
            </button>
          </div>
          
        </div>

        <!-- Footer Control Operational Command Buttons Layer -->
        <div class="ui-timepicker-footer">
          <button type="button" class="ui-footer-btn plain" (click)="clearValue()">Clear</button>
          <button type="button" class="ui-footer-btn confirmation" (click)="confirmSelection()">Apply</button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
      width: 100%;
      max-width: 240px;
      --picker-primary: var(--color-primary-600, #2563eb);
      --picker-bg: #ffffff;
      --picker-border: #d1d5db;
      --picker-text: #111827;
      --picker-hover: #f3f4f6;
    }

    .ui-timepicker-container { position: relative; width: 100%; }

    .ui-timepicker-trigger {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px; background: var(--picker-bg);
      border: 1px solid var(--picker-border); border-radius: 8px;
      font-size: 14px; color: var(--picker-text);
      cursor: pointer; outline: none; transition: all 0.15s ease;
    }
    .ui-timepicker-trigger:hover:not(.is-disabled) { border-color: #9ca3af; }
    .ui-timepicker-trigger.is-open { border-color: var(--picker-primary); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15); }
    .ui-timepicker-trigger.is-disabled { background: #f3f4f6; color: #9ca3af; cursor: not-allowed; opacity: 0.7; }

    .ui-timepicker-icon { color: #9ca3af; display: inline-flex; }
    .ui-timepicker-trigger.is-open .ui-timepicker-icon { color: var(--picker-primary); }

    /* Exquisite selection panel list structures layout layer mechanics options */
    .ui-timepicker-dropdown {
      position: absolute; top: calc(100% + 6px); left: 0; right: 0;
      z-index: 50; background: #ffffff; border: 1px solid #e5e7eb;
      border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
      overflow: hidden; animation: slideDownPicker 0.15s ease-out;
    }
    @keyframes slideDownPicker {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .ui-timepicker-columns { display: flex; height: 180px; border-bottom: 1px solid #f3f4f6; }
    .ui-timepicker-col {
      flex: 1; overflow-y: auto; display: flex; flex-direction: column;
      padding: 6px 4px; scroll-behavior: smooth; border-right: 1px solid #f3f4f6;
    }
    .ui-timepicker-col:last-child { border-right: none; }
    .ui-timepicker-col::-webkit-scrollbar { width: 4px; }
    .ui-timepicker-col::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }

    .ui-timepicker-opt {
      width: 100%; border: none; background: transparent; padding: 8px 0;
      font-size: 13px; font-weight: 500; color: #4b5563; border-radius: 6px;
      cursor: pointer; text-align: center; transition: all 0.1s ease; outline: none;
    }
    .ui-timepicker-opt:hover { background: var(--picker-hover); color: var(--picker-text); }
    .ui-timepicker-opt.is-selected { background: var(--color-primary-50, #eff6ff); color: var(--picker-primary); font-weight: 600; }

    .period-col { justify-content: center; gap: 8px; }

    /* Footer layouts system parameters definitions properties styles options */
    .ui-timepicker-footer { display: flex; justify-content: space-between; padding: 8px 12px; background: #f9fafb; }
    .ui-footer-btn { font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer; }
    .ui-footer-btn.plain { background: transparent; color: #6b7280; }
    .ui-footer-btn.plain:hover { color: #111827; background: #f3f4f6; }
    .ui-footer-btn.confirmation { background: var(--picker-primary); color: white; }
    .ui-footer-btn.confirmation:hover { filter: brightness(1.08); }
  `],
})
export class TimePickerComponent {
  // Signal Inputs and Two-Way Models APIs
  value = model<string>(''); // 24hr format string token standard "HH:mm" (e.g. "14:30")
  placeholder = input<string>('Select time');
  disabled = input<boolean>(false);

  // Operational Reactive Signals Matrix
  dropdownOpen = signal<boolean>(false);
  selectedHour = signal<string | null>(null);
  selectedMinute = signal<string | null>(null);
  selectedPeriod = signal<'AM' | 'PM'>('AM');

  // Hardcoded selection choices
  hours = Array.from({ length: 12 }, (_, i) => String(i === 0 ? 12 : i).padStart(2, '0'));
  minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')); // 5 minute incremental chunks

  // Dynamic values computation logic mapping 24h standard to AM/PM readable values
  displayValue = computed(() => {
    const raw = this.value();
    if (!raw || !raw.includes(':')) return '';
    
    const [hRaw, mStr] = raw.split(':');
    let hNum = parseInt(hRaw, 10);
    const period = hNum >= 12 ? 'PM' : 'AM';
    
    hNum = hNum % 12;
    if (hNum === 0) hNum = 12;
    const hStr = String(hNum).padStart(2, '0');
    
    return `${hStr}:${mStr} ${period}`;
  });

  constructor(private elementRef: ElementRef) {
    // Structural side effect logic listening to incoming programmatic shifts
    effect(() => {
      const raw = this.value();
      if (raw && raw.includes(':')) {
        const [hRaw, mStr] = raw.split(':');
        let hNum = parseInt(hRaw, 10);
        const period = hNum >= 12 ? 'PM' : 'AM';
        hNum = hNum % 12;
        if (hNum === 0) hNum = 12;
        
        this.selectedHour.set(String(hNum).padStart(2, '0'));
        this.selectedMinute.set(mStr);
        this.selectedPeriod.set(period);
      }
    }, { allowSignalWrites: true });
  }

  // Intercepting external blur context clicks to self-close dropdown
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen.set(false);
    }
  }

  toggleDropdown() {
    this.dropdownOpen.update(v => !v);
  }

  selectHour(h: string) { this.selectedHour.set(h); }
  selectMinute(m: string) { this.selectedMinute.set(m); }
  selectPeriod(p: 'AM' | 'PM') { this.selectedPeriod.set(p); }

  clearValue() {
    this.value.set('');
    this.selectedHour.set(null);
    this.selectedMinute.set(null);
    this.dropdownOpen.set(false);
  }

  confirmSelection() {
    const hour = this.selectedHour() || '12';
    const min = this.selectedMinute() || '00';
    const period = this.selectedPeriod();

    let hNum = parseInt(hour, 10);
    if (period === 'PM' && hNum < 12) hNum += 12;
    if (period === 'AM' && hNum === 12) hNum = 0;

    const h24 = String(hNum).padStart(2, '0');
    this.value.set(`${h24}:${min}`);
    this.dropdownOpen.set(false);
  }
}