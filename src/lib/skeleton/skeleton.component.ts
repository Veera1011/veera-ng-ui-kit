import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonVariant = 'text' | 'circle' | 'rect' | 'card' | 'avatar-row' | 'table-row';

@Component({
  selector: 'ui-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Basic shapes -->
    <span
      *ngIf="variant === 'text'"
      class="ui-skel ui-skel-text"
      [style.width]="width || '100%'"
      [style.height]="height || '14px'"
    ></span>

    <span
      *ngIf="variant === 'circle'"
      class="ui-skel ui-skel-circle"
      [style.width]="width || '40px'"
      [style.height]="height || width || '40px'"
    ></span>

    <span
      *ngIf="variant === 'rect'"
      class="ui-skel ui-skel-rect"
      [style.width]="width || '100%'"
      [style.height]="height || '120px'"
    ></span>

    <!-- Composite: card -->
    <div class="ui-skel-card" *ngIf="variant === 'card'">
      <span class="ui-skel ui-skel-rect" style="height:140px;"></span>
      <span class="ui-skel ui-skel-text" style="width:70%; height:16px; margin-top:12px;"></span>
      <span class="ui-skel ui-skel-text" style="width:40%; height:12px; margin-top:8px;"></span>
    </div>

    <!-- Composite: avatar + two lines -->
    <div class="ui-skel-avatar-row" *ngIf="variant === 'avatar-row'">
      <span class="ui-skel ui-skel-circle" style="width:40px; height:40px;"></span>
      <div class="ui-skel-avatar-lines">
        <span class="ui-skel ui-skel-text" style="width:120px; height:13px;"></span>
        <span class="ui-skel ui-skel-text" style="width:80px; height:11px; margin-top:6px;"></span>
      </div>
    </div>

    <!-- Composite: table row -->
    <div class="ui-skel-table-row" *ngIf="variant === 'table-row'">
      <span class="ui-skel ui-skel-text" *ngFor="let c of tableColumns" [style.width]="c"></span>
    </div>
  `,
  styles: [`
    .ui-skel {
      display: inline-block;
      background: linear-gradient(
        100deg,
        var(--color-gray-100, #eee) 30%,
        var(--color-gray-200, #e0e0e0) 50%,
        var(--color-gray-100, #eee) 70%
      );
      background-size: 200% 100%;
      animation: ui-skel-shimmer 1.4s ease-in-out infinite;
    }
    @keyframes ui-skel-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .ui-skel-text { border-radius: var(--radius-sm, 4px); }
    .ui-skel-circle { border-radius: 999px; }
    .ui-skel-rect { border-radius: var(--radius-md, 8px); }

    .ui-skel-card {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: var(--space-4, 16px);
      border: var(--border-width-thin) solid var(--color-gray-200, #e5e5e5);
      border-radius: var(--radius-lg, 14px);
      box-sizing: border-box;
    }

    .ui-skel-avatar-row {
      display: flex;
      align-items: center;
      gap: var(--space-3, 12px);
    }
    .ui-skel-avatar-lines {
      display: flex;
      flex-direction: column;
    }

    .ui-skel-table-row {
      display: flex;
      align-items: center;
      gap: var(--space-5, 20px);
      padding: var(--space-3, 12px) 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .ui-skel { animation: none; background: var(--color-gray-100, #eee); }
    }
  `],
})
export class SkeletonComponent {
  @Input() variant: SkeletonVariant = 'text';
  @Input() width?: string;
  @Input() height?: string;
  @Input() tableColumns: string[] = ['20%', '30%', '20%', '15%'];
}