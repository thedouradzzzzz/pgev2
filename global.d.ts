
// This file is used to declare global types, specifically to help TypeScript
// understand custom JSX attributes like those used by styled-jsx.

declare namespace JSX {
  interface IntrinsicElements {
    style: React.DetailedHTMLProps<
      React.StyleHTMLAttributes<HTMLStyleElement>, 
      HTMLStyleElement
    > & {
      jsx?: boolean;
      global?: boolean;
    };
  }
}

// Ensure this file is treated as a module.
export {};
