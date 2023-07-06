const taxFormulas = [
  {
    min: 0,
    max: 50000,
    baseRate: 0,
    taxRate: 0,
  },
  {
    min: 50001,
    max: 300000,
    baseRate: 9000,
    taxRate: 25,
  },
  {
    min: 300001,
    max: 500000,
    baseRate: 59000,
    taxRate: 28,
  },
  {
    min: 500001,
    max: 800000,
    baseRate: 115000,
    taxRate: 30,
  },
  {
    min: 800001,
    max: 1500000,
    baseRate: 205000,
    taxRate: 32,
  },
  {
    min: 1500001,
    max: Infinity,
    baseRate: 429000,
    taxRate: 37,
  },
];

const findFormula = (annualAmount: number) => {
  const formula = taxFormulas.find(
    (f) => annualAmount >= f.min && annualAmount < f.max
  );
  if (!formula) throw new Error("Formula not found!");

  return formula;
};
export const incomeTaxFunction = (monthlyAmount: number) => {
  const annualAmount = monthlyAmount * 12;
  const formula = findFormula(annualAmount);

  const ratedAmount =
    (annualAmount - (formula.min - 1)) * (formula.taxRate / 100);
  const annualTax = formula.baseRate + ratedAmount;

  return annualTax / 12;
};

