export {};

declare global {
  interface Window {
    app: {
      onSave: (callback: () => void) => () => void;
    };
    kernel: {
      run: (code: string) => Promise<any>;
      reset: () => Promise<any>;
    };
  }
}
