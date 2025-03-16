// This file contains type declarations for React
// to fix TypeScript errors in our project

declare module 'react' {
  export const useState: any;
  export const useEffect: any;
  export const useCallback: any;
  export const Suspense: any;
  export default any;
}

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
