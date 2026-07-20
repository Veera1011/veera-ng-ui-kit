import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FlipTrigger = 'click' | 'hover';
export type FlipDirection = 'horizontal' | 'vertical';

@Component({
  selector: 'ui-flip-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="ui-flip"
      [class.ui-flip-hover]="trigger === 'hover'"
      [class.ui-flip-flipped]="flipped"
      [class.ui-flip-vertical]="direction === 'vertical'"
      (click)="onCardClick()"
      role="button"
      [attr.aria-pressed]="flipped"
      tabindex="0"
      (keydown.enter)="onCardClick()"
      (keydown.space)="onSpace($event)"
    >
      <div class="ui-flip-inner">
        <div class="ui-flip-face ui-flip-front">
          <ng-content select="[front]"></ng-content>
        </div>
        <div class="ui-flip-face ui-flip-back">
          <ng-content select="[back]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ui-flip {
      perspective: 1200px;
      cursor: pointer;
      outline: none;
      width: 100%;
      height: 100%;
    }
    .ui-flip:focus-visible .ui-flip-inner {
      box-shadow: var(--shadow-focus);
      border-radius: var(--radius-lg, 14px);
    }

    .ui-flip-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transition: transform 600ms cubic-bezier(0.4, 0.2, 0.2, 1);
      transform-style: preserve-3d;
    }

    /* Click mode: flip driven by state class */
    .ui-flip-flipped .ui-flip-inner {
      transform: rotateY(180deg);
    }
    .ui-flip-vertical.ui-flip-flipped .ui-flip-inner {
      transform: rotateX(180deg);
    }

    /* Hover mode: flip driven purely by CSS :hover, no click/JS needed */
    .ui-flip-hover:hover .ui-flip-inner {
      transform: rotateY(180deg);
    }
    .ui-flip-hover.ui-flip-vertical:hover .ui-flip-inner {
      transform: rotateX(180deg);
    }

    .ui-flip-face {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border-radius: var(--radius-lg, 14px);
      overflow: hidden;
      background: var(--color-white);
      box-shadow: var(--shadow-md, 0 8px 24px rgba(0,0,0,0.10));
      border: var(--border-width-thin) solid var(--color-gray-200, #e8e8e8);
      display: flex;
      flex-direction: column;
    }

    .ui-flip-front {
      transform: rotateY(0deg);
      z-index: 2;
    }

    .ui-flip-back {
      transform: rotateY(180deg);
    }
    .ui-flip-vertical .ui-flip-back {
      transform: rotateX(180deg);
    }
  `],
})
export class FlipCardComponent {
  @Input() flipped = false;
  @Input() trigger: FlipTrigger = 'click';
  @Input() direction: FlipDirection = 'horizontal';

  @Output() flippedChange = new EventEmitter<boolean>();

  onCardClick() {
    if (this.trigger !== 'click') return;
    this.flippedChange.emit(!this.flipped);
  }

  onSpace(event: Event) {
    event.preventDefault();
    this.onCardClick();
  }
}