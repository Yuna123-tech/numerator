export interface FractionObject {
  whole: number;
  num: number;
  den: number;
}

export enum FractionType {
  Proper = '진분수',
  Improper = '가분수',
  Mixed = '대분수',
  Integer = '정수',
  Invalid = '올바르지 않은 분수'
}

export type Operator = '+' | '-' | '×' | '÷';

export enum Tab {
  Learn = 'Learn',
  Convert = 'Convert',
  Calculate = 'Calculate',
}
