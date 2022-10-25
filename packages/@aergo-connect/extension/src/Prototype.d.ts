declare global {
  interface String {
    isEmpty(): boolean;
    countDecimals(): function;
  }
  interface Number {
    countDecimals(): function;
  }
}

export {};
