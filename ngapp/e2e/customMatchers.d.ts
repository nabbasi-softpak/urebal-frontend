declare module jasmine {
  interface Matchers {
    toEqualEachCellInColumn(expected:string): boolean;
  }
}
