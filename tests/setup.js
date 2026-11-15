// Vitest setup for DOM matchers & global polyfills
import '@testing-library/jest-dom';

// Ensure window.matchMedia exists for responsive components
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// Mock window.print
if (typeof window !== 'undefined') {
  window.print = () => {};
}
