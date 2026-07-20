import { Component, input, model, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-expansion-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ui-expansion-card" [class.is-expanded]="expanded()" [class.is-disabled]="disabled()">
      
      <!-- HEADER CLICK TRIGGER SEGMENT -->
      <div 
        class="ui-expansion-header"
        (click)="!disabled() && toggleExpand()"
        (keydown.enter)="!disabled() && toggleExpand()"
        (keydown.space)="!disabled() && toggleExpand(); $event.preventDefault()"
        [attr.tabindex]="disabled() ? null : '0'"
        role="button"
        [attr.aria-expanded]="expanded()"
        [attr.aria-disabled]="disabled()"
      >
        <div class="ui-header-content">
          <span class="ui-panel-title">{{ title() }}</span>
          <span *ngIf="subtitle()" class="ui-panel-subtitle">{{ subtitle() }}</span>
        </div>
        
        <!-- Animated Chevron Indicator Icon -->
        <div class="ui-panel-chevron">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <!-- COLLAPSIBLE ACCORDION BODY AREA -->
      <div 
        class="ui-expansion-body-wrapper"
        [style.max-height]="expanded() ? '1000px' : '0px'"
        role="region"
        [attr.aria-hidden]="!expanded()"
      >
        <div class="ui-expansion-body-content">
          <ng-content></ng-content>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      --panel-bg: #ffffff;
      --panel-border: #e5e7eb;
      --panel-text-title: #111827;
      --panel-text-sub: #6b7280;
      --panel-primary: var(--color-primary-600, #2563eb);
    }

    .ui-expansion-card {
      background: var(--panel-bg);
      border: 1px solid var(--panel-border);
      border-radius: 8px;
      overflow: hidden;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    
    .ui-expansion-card.is-expanded {
      border-color: #cbd5e1;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
    }

    .ui-expansion-card.is-disabled {
      opacity: 0.6;
      background: #f9fafb;
    }

    /* Header styling and micro-interactions layout */
    .ui-expansion-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      cursor: pointer;
      user-select: none;
      outline: none;
      background: var(--panel-bg);
      transition: background-color 0.1s ease;
    }
    .ui-expansion-card.is-disabled .ui-expansion-header {
      cursor: not-allowed;
    }
    .ui-expansion-header:hover:not(.is-disabled) {
      background-color: #f9fafb;
    }
    .ui-expansion-header:focus-visible {
      background-color: #f3f4f6;
      box-shadow: inset 0 0 0 2px var(--panel-primary);
    }

    .ui-header-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .ui-panel-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--panel-text-title);
    }

    .ui-panel-subtitle {
      font-size: 12.5px;
      color: var(--panel-text-sub);
    }

    .ui-panel-chevron {
      color: #9ca3af;
      display: inline-flex;
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.15s ease;
    }
    .ui-expansion-header:hover .ui-panel-chevron {
      color: #6b7280;
    }
    .is-expanded .ui-panel-chevron {
      transform: rotate(180deg);
      color: var(--panel-primary);
    }

    /* Smooth CSS slide-down engine calculations */
    .ui-expansion-body-wrapper {
      overflow: hidden;
      transition: max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .ui-expansion-body-content {
      padding: 16px 18px;
      border-top: 1px solid #eeeff1;
      font-size: 13.5px;
      color: #374151;
      line-height: 1.5;
      background-color: #ffffff;
    }
  `]
})
export class ExpansionPanelComponent {
  // Input Definitions and Two-Way Value Models
  title = input.required<string>();
  subtitle = input<string>('');
  disabled = input<boolean>(false);
  
  expanded = model<boolean>(false);

  toggleExpand(): void {
    this.expanded.update(state => !state);
  }
}