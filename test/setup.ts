import '@testing-library/jest-dom';

// Radix UI requires pointer/scroll APIs not available in jsdom
Element.prototype.hasPointerCapture = () => false;
Element.prototype.setPointerCapture = () => {};
Element.prototype.releasePointerCapture = () => {};
Element.prototype.scrollIntoView = () => {};
