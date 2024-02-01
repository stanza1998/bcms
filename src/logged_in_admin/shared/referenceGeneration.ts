export function generateInvoiceNumber(): string {
    const randomNumber = Math.floor(Math.random() * 10000);
    const formattedNumber = randomNumber.toString().padStart(4, "0");
    const number = `INV000${formattedNumber}`;
    return number;
};