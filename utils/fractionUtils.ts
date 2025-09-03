import type { FractionObject } from '../types';
import { FractionType } from '../types';

export const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

export const lcm = (a: number, b: number): number => {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
}

export const getFractionType = (num: number, den: number): FractionType => {
  if (den === 0) return FractionType.Invalid;
  if (num === 0) return FractionType.Proper; // Or Integer, but let's be specific for learning
  if (num % den === 0) return FractionType.Integer;
  if (num > den) return FractionType.Improper;
  return FractionType.Proper;
};

export const toImproper = (frac: FractionObject): { num: number, den: number } => {
  return { num: frac.whole * frac.den + frac.num, den: frac.den };
};

export const toMixed = (num: number, den: number): FractionObject => {
  if (den === 0) return { whole: 0, num: num, den: den };
  const whole = Math.floor(num / den);
  const newNum = num % den;
  return { whole, num: newNum, den };
};

export const simplify = (num: number, den: number): { num: number, den: number } => {
    if (den === 0 || num === 0) return {num, den};
    const common = gcd(Math.abs(num), Math.abs(den));
    return { num: num / common, den: den / common };
}

export const calculate = (f1: FractionObject, f2: FractionObject, op: string): FractionObject => {
    const imp1 = toImproper(f1);
    const imp2 = toImproper(f2);
    let resNum, resDen;

    switch (op) {
        case '+':
            resNum = imp1.num * imp2.den + imp2.num * imp1.den;
            resDen = imp1.den * imp2.den;
            break;
        case '-':
            resNum = imp1.num * imp2.den - imp2.num * imp1.den;
            resDen = imp1.den * imp2.den;
            break;
        case '×':
            resNum = imp1.num * imp2.num;
            resDen = imp1.den * imp2.den;
            break;
        case '÷':
            resNum = imp1.num * imp2.den;
            resDen = imp1.den * imp2.num;
            break;
        default:
            return { whole: 0, num: 0, den: 1 };
    }

    if (resDen < 0) {
        resNum = -resNum;
        resDen = -resDen;
    }
    
    if (resNum === 0) {
        return { whole: 0, num: 0, den: 1 };
    }

    const simplified = simplify(resNum, resDen);
    return toMixed(simplified.num, simplified.den);
};