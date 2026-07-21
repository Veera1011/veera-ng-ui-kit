import {
  ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, HostListener, Input,
  OnChanges, OnDestroy, OnInit, Output, TemplateRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="ui-carousel"
      (mouseenter)="pauseAutoplay()"
      (mouseleave)="resumeAutoplay()"
    >
      <div class="ui-carousel-viewport" #viewport>
        <div
          class="ui-carousel-track"
          [style.transform]="'translateX(' + trackOffset + '%)'"
          [style.transition]="(dragging || snapping) ? 'none' : 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)'"
          (pointerdown)="onPointerDown($event)"
          (pointermove)="onPointerMove($event)"
          (pointerup)="onPointerUp()"
          (pointerleave)="onPointerUp()"
        >
          <div
            class="ui-carousel-slide"
            *ngFor="let item of displayItems"
            [style.width.%]="100 / itemsPerView"
          >
            <ng-container
              [ngTemplateOutlet]="slideTemplate"
              [ngTemplateOutletContext]="{ $implicit: item }"
            ></ng-container>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="ui-carousel-arrow ui-carousel-arrow-prev"
        *ngIf="showArrows"
        (click)="prev()"
        [disabled]="!effectiveLoop && activeIndex === 0"
        aria-label="Previous slide"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button
        type="button"
        class="ui-carousel-arrow ui-carousel-arrow-next"
        *ngIf="showArrows"
        (click)="next()"
        [disabled]="!effectiveLoop && activeIndex >= items.length - itemsPerView"
        aria-label="Next slide"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>

      <div class="ui-carousel-dots" *ngIf="showDots">
        <button
          *ngFor="let i of dotIndexes"
          type="button"
          class="ui-carousel-dot"
          [class.ui-carousel-dot-active]="i === activeIndex"
          (click)="goTo(i)"
          [attr.aria-label]="'Go to slide ' + (i + 1)"
        ></button>
      </div>
    </div>
  `,
  styles: [`
    .ui-carousel { position: relative; width: 100%; }
    .ui-carousel-viewport { overflow: hidden; width: 100%; border-radius: var(--radius-lg, 14px); }
    .ui-carousel-track { display: flex; touch-action: pan-y; cursor: grab; user-select: none; }
    .ui-carousel-track:active { cursor: grabbing; }
    .ui-carousel-slide { flex-shrink: 0; padding: 0 var(--space-2, 8px); box-sizing: border-box; }
    .ui-carousel-arrow {
      position: absolute; top: 50%; transform: translateY(-50%);
      width: 36px; height: 36px;
      display: inline-flex; align-items: center; justify-content: center;
      border: var(--border-width-thin) solid var(--color-gray-200, #e5e5e5);
      border-radius: 999px; background: var(--color-white); color: var(--color-gray-700, #333);
      cursor: pointer; box-shadow: var(--shadow-sm, 0 2px 8px rgba(0,0,0,0.08));
      transition: background 150ms var(--motion-ease-standard), transform 150ms var(--motion-ease-standard);
    }
    .ui-carousel-arrow:hover:not(:disabled) { background: var(--color-gray-50, #fafafa); transform: translateY(-50%) scale(1.05); }
    .ui-carousel-arrow:disabled { opacity: 0.35; cursor: not-allowed; }
    .ui-carousel-arrow-prev { left: -18px; }
    .ui-carousel-arrow-next { right: -18px; }
    .ui-carousel-dots { display: flex; justify-content: center; gap: var(--space-2, 8px); margin-top: var(--space-4, 16px); }
    .ui-carousel-dot {
      width: 8px; height: 8px; border-radius: 999px; border: none;
      background: var(--color-gray-200, #e0e0e0); cursor: pointer; padding: 0;
      transition: background 200ms var(--motion-ease-standard), width 200ms var(--motion-ease-standard);
    }
    .ui-carousel-dot:hover { background: var(--color-gray-400, #999); }
    .ui-carousel-dot-active { background: var(--color-primary-500); width: 20px; }
  `],
})
export class CarouselComponent implements OnInit, OnChanges, OnDestroy {
  @Input() items: any[] = [];
  @Input() itemsPerView = 1;
  @Input() loop = false;
  @Input() autoplay = false;
  @Input() autoplayInterval = 4000;
  @Input() showArrows = true;
  @Input() showDots = true;

  @Output() activeIndexChange = new EventEmitter<number>();

  @ViewChild('viewport') viewportRef?: ElementRef<HTMLDivElement>;
  @ContentChild(TemplateRef) slideTemplate!: TemplateRef<any>;

  trackIndex = 0;
  trackOffset = 0;
  dragging = false;
  snapping = false;

  private cloneCount = 0;
  private dragStartX = 0;
  private dragDeltaX = 0;
  private autoplayTimer: any;
  private snapTimer: any;

  constructor(private cdr: ChangeDetectorRef) {}

  get effectiveLoop(): boolean {
    return this.loop && this.items.length > this.itemsPerView;
  }

  get displayItems(): any[] {
    if (!this.effectiveLoop) return this.items;
    const front = this.items.slice(this.items.length - this.cloneCount);
    const back = this.items.slice(0, this.cloneCount);
    return [...front, ...this.items, ...back];
  }

  get activeIndex(): number {
    if (!this.effectiveLoop) return this.trackIndex;
    const total = this.items.length;
    return ((this.trackIndex - this.cloneCount) % total + total) % total;
  }

  get dotIndexes(): number[] {
    const dotCount = Math.max(1, this.items.length - this.itemsPerView + 1);
    return Array.from({ length: dotCount }, (_, i) => i);
  }

  ngOnInit() {
    this.resetTrack();
    if (this.autoplay) this.startAutoplay();
  }

  ngOnChanges() {
    this.resetTrack();
  }

  ngOnDestroy() {
    this.stopAutoplay();
    clearTimeout(this.snapTimer);
  }

  private resetTrack() {
    this.cloneCount = Math.min(this.itemsPerView, this.items.length);
    this.trackIndex = this.effectiveLoop ? this.cloneCount : 0;
    this.updateOffset();
  }

  next() {
    if (this.effectiveLoop) {
      this.trackIndex++;
      this.updateOffset();
      this.scheduleLoopBoundaryCheck();
      this.activeIndexChange.emit(this.activeIndex);
      this.restartAutoplayIfActive();
      return;
    }
    const maxIndex = this.items.length - this.itemsPerView;
    if (this.trackIndex >= maxIndex) return;
    this.goTo(this.trackIndex + 1);
  }

  prev() {
    if (this.effectiveLoop) {
      this.trackIndex--;
      this.updateOffset();
      this.scheduleLoopBoundaryCheck();
      this.activeIndexChange.emit(this.activeIndex);
      this.restartAutoplayIfActive();
      return;
    }
    if (this.trackIndex <= 0) return;
    this.goTo(this.trackIndex - 1);
  }

  goTo(realIndex: number) {
    const maxIndex = Math.max(0, this.items.length - this.itemsPerView);
    const clamped = Math.min(Math.max(realIndex, 0), maxIndex);
    this.trackIndex = this.effectiveLoop ? clamped + this.cloneCount : clamped;
    this.updateOffset();
    this.activeIndexChange.emit(this.activeIndex);
    this.restartAutoplayIfActive();
  }

  private updateOffset() {
    const slideWidthPercent = 100 / this.itemsPerView;
    this.trackOffset = -(this.trackIndex * slideWidthPercent);
  }

  private scheduleLoopBoundaryCheck() {
    clearTimeout(this.snapTimer);
    this.snapTimer = setTimeout(() => {
      const total = this.items.length;
      if (this.trackIndex >= this.cloneCount + total) {
        this.snapTo(this.trackIndex - total);
      } else if (this.trackIndex < this.cloneCount) {
        this.snapTo(this.trackIndex + total);
      }
      this.cdr.detectChanges(); // ← ensure the boundary snap actually paints
    }, 430);
  }

  private snapTo(newTrackIndex: number) {
    this.snapping = true;
    this.trackIndex = newTrackIndex;
    this.updateOffset();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.snapping = false;
      this.cdr.detectChanges(); // ← ensure re-enabling the transition actually paints
    }));
  }

  onPointerDown(event: PointerEvent) {
    this.dragging = true;
    this.dragStartX = event.clientX;
    this.dragDeltaX = 0;
    this.pauseAutoplay();
  }

  onPointerMove(event: PointerEvent) {
    if (!this.dragging || !this.viewportRef) return;
    this.dragDeltaX = event.clientX - this.dragStartX;
    const viewportWidth = this.viewportRef.nativeElement.offsetWidth;
    const deltaPercent = (this.dragDeltaX / viewportWidth) * 100;
    const baseOffset = -(this.trackIndex * (100 / this.itemsPerView));
    this.trackOffset = baseOffset + deltaPercent;
  }

  onPointerUp() {
    if (!this.dragging) return;
    this.dragging = false;

    const threshold = 40;
    if (this.dragDeltaX > threshold) {
      this.prev();
    } else if (this.dragDeltaX < -threshold) {
      this.next();
    } else {
      this.updateOffset();
    }
    this.resumeAutoplay();
  }

  private startAutoplay() {
    this.stopAutoplay();
    this.autoplayTimer = setInterval(() => {
      this.next();
      this.cdr.detectChanges(); // ← the actual fix: force a repaint after each timer tick
    }, this.autoplayInterval);
  }
  private stopAutoplay() { clearInterval(this.autoplayTimer); }
  pauseAutoplay() { if (this.autoplay) this.stopAutoplay(); }
  resumeAutoplay() { if (this.autoplay) this.startAutoplay(); }
  private restartAutoplayIfActive() { if (this.autoplay) this.startAutoplay(); }

  @HostListener('window:resize')
  onResize() { this.updateOffset(); }
}