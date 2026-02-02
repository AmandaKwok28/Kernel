export {};

declare global {
  interface Window {
    kernel: {
      run: (code: string) => Promise<{
        ok: boolean;
        stdout?: string;
        stderr?: string;
        result?: string;
        error?: string;
        id?: number;
        images?: string[]; 
      }>;
      reset: () => Promise<any>;
    };

    app: {
      onSave: (callback: () => void) => void;
    };
  }
}
