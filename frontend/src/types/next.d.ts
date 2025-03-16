// This file contains type declarations for Next.js modules
// to fix TypeScript errors in our project

// Add React namespace declaration
declare namespace React {
  interface ReactNode {}
  interface RefObject<T> {}
  interface CSSProperties {}
  interface KeyboardEvent {
    key: string;
    preventDefault: () => void;
  }
  type FC<P = {}> = (props: P) => JSX.Element;
  type ComponentType<P = {}> = React.FC<P>;
}

declare module 'next/image' {
  import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';

  export interface ImageProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    quality?: number;
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    unoptimized?: boolean;
    onLoadingComplete?: (result: { naturalWidth: number; naturalHeight: number }) => void;
    layout?: 'fixed' | 'intrinsic' | 'responsive' | 'fill';
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    objectPosition?: string;
    lazyBoundary?: string;
    lazyRoot?: React.RefObject<HTMLElement>;
    className?: string;
    [key: string]: any;
  }

  const Image: React.FC<ImageProps>;
  export default Image;
}

declare module 'next/link' {
  import { LinkHTMLAttributes } from 'react';

  export interface LinkProps extends LinkHTMLAttributes<HTMLAnchorElement> {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    className?: string;
    'aria-label'?: string;
    [key: string]: any;
  }

  const Link: React.FC<LinkProps>;
  export default Link;
}

declare module 'next/navigation' {
  export function useRouter(): {
    push: (url: string, options?: { shallow?: boolean }) => void;
    replace: (url: string, options?: { shallow?: boolean }) => void;
    prefetch: (url: string) => void;
    back: () => void;
    reload: () => void;
    events: {
      on: (event: string, callback: (...args: any[]) => void) => void;
      off: (event: string, callback: (...args: any[]) => void) => void;
    };
  };

  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function notFound(): never;
}

declare module 'next/font/google' {
  export interface FontOptions {
    weight?: string | string[];
    style?: string | string[];
    subsets?: string[];
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
    axes?: string[];
    fallback?: string[];
    adjustFontFallback?: boolean;
    variable?: string;
    preload?: boolean;
  }

  export function Inter(options: FontOptions): {
    className: string;
    style: React.CSSProperties;
    variable: string;
  };

  export function Playfair_Display(options: FontOptions): {
    className: string;
    style: React.CSSProperties;
    variable: string;
  };
}

declare module 'next/script' {
  import { DetailedHTMLProps, ScriptHTMLAttributes } from 'react';

  export interface ScriptProps extends DetailedHTMLProps<ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement> {
    strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload';
    onLoad?: () => void;
    onError?: () => void;
    onReady?: () => void;
    id?: string;
    src?: string;
    [key: string]: any; // Allow additional properties
  }

  const Script: React.FC<ScriptProps>;
  export default Script;
}

declare module 'next' {
  export interface Metadata {
    title?: string;
    description?: string;
    keywords?: string | string[];
    authors?: Array<{ name: string; url?: string }>;
    creator?: string;
    publisher?: string;
    robots?: string;
    canonical?: string;
    openGraph?: {
      title?: string;
      description?: string;
      url?: string;
      siteName?: string;
      images?: Array<{
        url: string;
        width?: number;
        height?: number;
        alt?: string;
      }>;
      locale?: string;
      type?: string;
    };
    twitter?: {
      card?: 'summary' | 'summary_large_image' | 'app' | 'player';
      site?: string;
      creator?: string;
      title?: string;
      description?: string;
      images?: string | string[];
    };
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'next/dynamic' {
  import { ComponentType } from 'react';

  export interface DynamicOptions {
    loading?: ComponentType;
    ssr?: boolean;
    suspense?: boolean;
  }

  export default function dynamic<P = {}>(
    dynamicOptions: () => Promise<ComponentType<P>>,
    options?: DynamicOptions
  ): ComponentType<P>;
}
