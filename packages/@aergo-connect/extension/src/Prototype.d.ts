declare global {
  interface String {
    isEmpty(): boolean;
    countDecimals(): Function;
  }
  interface Number {
    countDecimals(): Function;
  }
}

export {};
