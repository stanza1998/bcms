export function CustomNumberFormat(number?: number) {
  return number?.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}