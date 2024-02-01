export const generateInvoiceNumber = () => {
    const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
    const formattedNumber = randomNumber.toString().padStart(4, "0"); // Pad the number with leading zeros if necessary
    const generatedInvoiceNumber = `INV000${formattedNumber}`; // Add the prefix "INV" to the number
    return generatedInvoiceNumber;
};
export const generateRCPNumber = () => {
    const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
    const formattedNumber = randomNumber.toString().padStart(4, "0"); // Pad the number with leading zeros if necessary
    const generatedInvoiceNumber = `RCP000${formattedNumber}`; // Add the prefix "INV" to the number
    return generatedInvoiceNumber;
};
