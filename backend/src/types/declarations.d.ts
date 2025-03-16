declare module 'traverson' {
  export function from(url: string): any;
  export function registerMediaType(mediaType: string, adapter: any): void;
}

declare module 'traverson-hal' {
  export const mediaType: string;
}
