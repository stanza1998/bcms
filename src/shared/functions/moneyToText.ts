import numWords from 'num-words';

export const moneyToText = (amount: number) => {

  if (amount === null || amount === 0 || amount === undefined)
    return "-";

  const text = numWords(amount);
  return text
}