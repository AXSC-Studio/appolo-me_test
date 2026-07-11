import "@testing-library/jest-dom";

// jsdom は scrollIntoView を未実装のため stub
Element.prototype.scrollIntoView = () => {};
