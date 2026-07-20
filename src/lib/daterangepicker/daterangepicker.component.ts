import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from '../datepicker/datepicker.component';

export interface DateRange {
  start: string;
  end: string;
}

@Component({
  selector: 'ui-date-range-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerComponent],
  template: `
    <div class="ui-date-range">
      <ui-date-picker
        [name]="name + '-start'"
        [value]="range.start"
        [max]="range.end || max"
        [min]="min"
        [disabled]="disabled"
        (valueChange)="onStartChange($event)"
      ></ui-date-picker>

      <span class="ui-date-range-sep">→</span>

      <ui-date-picker
        [name]="name + '-end'"
        [value]="range.end"
        [min]="range.start || min"
        [max]="max"
        [disabled]="disabled"
        (valueChange)="onEndChange($event)"
      ></ui-date-picker>
    </div>
  `,
  styles: [`
    .ui-date-range {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    .ui-date-range-sep {
      color: var(--color-gray-400, #999);
      font-size: var(--font-size-sm);
      flex-shrink: 0;
    }
  `],
})
export class DateRangePickerComponent {
  @Input() name = 'date-range';
  @Input() min = '';
  @Input() max = '';
  @Input() disabled = false;
  @Input() range: DateRange = { start: '', end: '' };

  @Output() rangeChange = new EventEmitter<DateRange>();

  onStartChange(value: string) {
    this.range = { ...this.range, start: value };
    this.rangeChange.emit(this.range);
  }

  onEndChange(value: string) {
    this.range = { ...this.range, end: value };
    this.rangeChange.emit(this.range);
  }
}