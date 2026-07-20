export interface DialogConfig<D = any> {
  data?: D;
  width?: string;
  maxWidth?: string;
  disableClose?: boolean;   // suppress backdrop click + Escape
  closeOnBackdrop?: boolean; // default true, ignored if disableClose is true
  panelClass?: string;       // extra class on the panel host for custom sizing/theming
}