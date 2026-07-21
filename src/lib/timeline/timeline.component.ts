import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TimelineStatus = 'default' | 'success' | 'warning' | 'danger' | 'active';
export type TimelineLayout = 'left' | 'alternating';

export interface TimelineItem {
  title: string;
  description?: string;
  timestamp?: string;
  status?: TimelineStatus;
  icon?: string;   // optional short label/emoji/initial shown inside the dot
}

@Component({
  selector: 'ui-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ui-timeline" [class.ui-timeline-alternating]="layout === 'alternating'">
      <div
        class="ui-timeline-row"
        *ngFor="let item of items; let i = index; let last = last"
        [class.ui-timeline-row-right]="layout === 'alternating' && i % 2 === 1"
      >
        <div class="ui-timeline-rail">
          <span
            class="ui-timeline-dot"
            [class]="'ui-timeline-dot-' + (item.status || 'default')"
          >
            <span *ngIf="item.icon">{{ item.icon }}</span>
          </span>
          <span class="ui-timeline-line" *ngIf="!last"></span>
        </div>

        <div class="ui-timeline-content">
          <div class="ui-timeline-header">
            <span class="ui-timeline-title">{{ item.title }}</span>
            <span class="ui-timeline-timestamp" *ngIf="item.timestamp">{{ item.timestamp }}</span>
          </div>
          <p class="ui-timeline-description" *ngIf="item.description">{{ item.description }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ui-timeline {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .ui-timeline-row {
      display: flex;
      gap: var(--space-4, 16px);
    }

    .ui-timeline-rail {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
    }

    .ui-timeline-dot {
      width: 28px;
      height: 28px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: var(--color-white);
      flex-shrink: 0;
      box-shadow: 0 0 0 4px var(--color-white);
    }
    .ui-timeline-dot-default { background: var(--color-gray-300, #ccc); }
    .ui-timeline-dot-active  { background: var(--color-primary-500); box-shadow: 0 0 0 4px var(--color-primary-50, #eef4ff), 0 0 0 6px var(--color-primary-500); }
    .ui-timeline-dot-success { background: var(--color-semantic-success, #1e9e5a); }
    .ui-timeline-dot-warning { background: var(--color-semantic-warning, #d99a1b); }
    .ui-timeline-dot-danger  { background: var(--color-semantic-danger, #d33); }

    .ui-timeline-line {
      width: 2px;
      flex: 1;
      background: var(--color-gray-200, #e5e5e5);
      margin: var(--space-1, 4px) 0;
      min-height: 24px;
    }

    .ui-timeline-content {
      padding-bottom: var(--space-6, 28px);
      flex: 1;
      min-width: 0;
    }

    .ui-timeline-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: var(--space-3, 12px);
    }
    .ui-timeline-title {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--color-gray-900, #111);
    }
    .ui-timeline-timestamp {
      font-size: var(--font-size-xs, 12px);
      color: var(--color-gray-400, #999);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .ui-timeline-description {
      margin: var(--space-1, 4px) 0 0;
      font-size: var(--font-size-sm);
      color: var(--color-gray-600, #555);
      line-height: 1.5;
    }

    /* Alternating layout — desktop only, falls back to left-aligned on small screens */
    @media (min-width: 700px) {
      .ui-timeline-alternating .ui-timeline-row {
        width: 100%;
        max-width: 640px;
        margin: 0 auto;
      }
      .ui-timeline-alternating .ui-timeline-row-right {
        flex-direction: row-reverse;
        text-align: right;
      }
      .ui-timeline-alternating .ui-timeline-row-right .ui-timeline-header {
        flex-direction: row-reverse;
      }
    }
  `],
})
export class TimelineComponent {
  @Input() items: TimelineItem[] = [];
  @Input() layout: TimelineLayout = 'left';
}