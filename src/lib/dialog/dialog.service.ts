import {
  ApplicationRef, ComponentRef, EnvironmentInjector,
  Injectable, Injector, Type, createComponent
} from '@angular/core';
import { DialogRef } from './dialog-ref';
import { DIALOG_DATA } from './dialog-data.token';
import { DialogConfig } from './dialog-config';

let stylesInjected = false;

@Injectable({ providedIn: 'root' })
export class DialogService {
  private stack: { overlay: HTMLElement; ref: DialogRef<any>; disableClose: boolean }[] = [];

  constructor(
    private appRef: ApplicationRef,
    private envInjector: EnvironmentInjector,
  ) {
    this.injectStylesOnce();
  }

  open<T, R = any, D = any>(component: Type<T>, config: DialogConfig<D> = {}): DialogRef<R> {
    const overlay = document.createElement('div');
    overlay.className = 'ui-dialog-overlay';

    const backdrop = document.createElement('div');
    backdrop.className = 'ui-dialog-backdrop';
    overlay.appendChild(backdrop);

    const panelHost = document.createElement('div');
    panelHost.className = 'ui-dialog-panel-host';
    if (config.panelClass) panelHost.classList.add(config.panelClass);
    if (config.width) panelHost.style.width = config.width;
    if (config.maxWidth) panelHost.style.maxWidth = config.maxWidth;
    overlay.appendChild(panelHost);

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    let dialogRef!: DialogRef<R>;
    let componentRef!: ComponentRef<T>;

    const destroy = (result?: R) => {
      backdrop.classList.remove('ui-dialog-backdrop-visible');
      panelHost.classList.remove('ui-dialog-panel-visible');
      setTimeout(() => {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
        overlay.remove();
        this.stack = this.stack.filter(entry => entry.overlay !== overlay);
        if (this.stack.length === 0) document.body.style.overflow = '';
      }, 220);
      dialogRef._emitClosed(result);
    };

    dialogRef = new DialogRef<R>(destroy);

    const dialogInjector = Injector.create({
      providers: [
        { provide: DIALOG_DATA, useValue: config.data },
        { provide: DialogRef, useValue: dialogRef },
      ],
      parent: this.envInjector,
    });

    componentRef = createComponent(component, {
      environmentInjector: this.envInjector,
      elementInjector: dialogInjector,
      hostElement: panelHost,
    });

    this.appRef.attachView(componentRef.hostView);

    const disableClose = !!config.disableClose;
    if (!disableClose && config.closeOnBackdrop !== false) {
      backdrop.addEventListener('click', () => destroy());
    }

    this.stack.push({ overlay, ref: dialogRef, disableClose });

    // enter animation — mount off-state first, flip visible next frame
    requestAnimationFrame(() => requestAnimationFrame(() => {
      backdrop.classList.add('ui-dialog-backdrop-visible');
      panelHost.classList.add('ui-dialog-panel-visible');
    }));

    return dialogRef;
  }

  /** Closes the topmost open dialog, e.g. from a global Escape handler. */
  closeTop() {
    const top = this.stack[this.stack.length - 1];
    if (top && !top.disableClose) top.ref.close();
  }

  private injectStylesOnce() {
    if (stylesInjected) return;
    stylesInjected = true;

    const style = document.createElement('style');
    style.setAttribute('data-ui-dialog', '');
    style.textContent = `
      .ui-dialog-overlay {
        position: fixed; inset: 0; z-index: 1200;
        display: flex; align-items: center; justify-content: center;
        padding: var(--space-5, 20px);
      }
      .ui-dialog-backdrop {
        position: absolute; inset: 0;
        background: rgba(15, 15, 20, 0.45);
        backdrop-filter: blur(0px);
        -webkit-backdrop-filter: blur(0px);
        opacity: 0;
        transition: opacity 220ms var(--motion-ease-standard, ease),
                    backdrop-filter 220ms var(--motion-ease-standard, ease);
      }
      .ui-dialog-backdrop-visible {
        opacity: 1;
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
      }
      .ui-dialog-panel-host {
        position: relative;
        width: 480px;
        max-width: 92vw;
        max-height: 88vh;
        overflow-y: auto;
        background: var(--color-white, #fff);
        border-radius: var(--radius-lg, 14px);
        box-shadow: var(--shadow-lg, 0 24px 60px rgba(0,0,0,0.24));
        opacity: 0;
        transform: scale(0.94) translateY(8px);
        transition: opacity 200ms var(--motion-ease-standard, ease),
                    transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      .ui-dialog-panel-visible {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    `;
    document.head.appendChild(style);
  }
}