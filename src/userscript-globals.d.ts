declare const alert: (message?: unknown) => void;
declare const confirm: (message?: string) => boolean;
declare const prompt: (message?: string, defaultValue?: string) => string | null;
declare const console: any;
declare const document: any;
declare const window: any;
declare const navigator: any;
declare const sessionStorage: any;
declare const MutationObserver: any;
declare const FileReader: any;
declare const Blob: any;
declare const URL: any;
declare const URLSearchParams: any;
declare const CSS: any;
declare const Event: any;
declare const CustomEvent: any;
declare const AbortController: any;
declare const fetch: any;
declare function setTimeout(handler: (...args: any[]) => void, timeout?: number, ...args: any[]): number;
declare function clearTimeout(handle?: number): void;
declare function getComputedStyle(element: any): any;

declare function GM_getValue(key: string, defaultValue?: any): Promise<any>;
declare function GM_setValue(key: string, value: any): Promise<void>;
declare function GM_registerMenuCommand(name: string, callback: () => void): void;
declare function GM_addStyle(css: string): void;
declare const GM_info: any;

declare interface GMXmlHttpRequestResponse<T = any> {
  status: number;
  statusText: string;
  responseText: string;
  response: T;
}

declare interface GMXmlHttpRequestOptions<T = any> {
  method: string;
  url: string;
  headers?: Record<string, string>;
  data?: string;
  timeout?: number;
  responseType?: "blob" | "json" | "text" | "arraybuffer";
  onload?: (response: GMXmlHttpRequestResponse<T>) => void;
  onerror?: (error: any) => void;
  ontimeout?: () => void;
}

declare function GM_xmlhttpRequest<T = any>(options: GMXmlHttpRequestOptions<T>): void;

declare module "*.css" {
  const css: string;
  export default css;
}
