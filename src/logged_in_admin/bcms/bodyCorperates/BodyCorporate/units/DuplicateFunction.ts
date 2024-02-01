import { collection, doc, runTransaction, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../shared/database/FirebaseConfig";
import { ICustomerTransactions } from "../../../../../shared/models/transactions/customer-transactions/CustomerTransactionModel";
import { IReceiptsPayments } from "../../../../../shared/models/receipts-payments/ReceiptsPayments";
import { IAccountTransactions } from "../../../../../shared/models/accounts-transaction/AccountsTransactionModel";
import { generateInvoiceNumber, generateRCPNumber } from "./tokens";
import { IInvoice } from "../../../../../shared/models/invoices/Invoices";
import AppApi from "../../../../../shared/apis/AppApi";
import { IUnit } from "../../../../../shared/models/bcms/Units";


interface IInvoiceUtilsProps {
    ref: string;
    newDate: string;
    newDateIssued: string;
    selection: string;
    property: string | undefined;
    masterInvoices: IInvoice[];
    api: AppApi;
    units: IUnit[];
    navigate: (path: string) => void;
    FailedAction: (ui: any) => void;
    FailedActionAllFields: (ui: any) => void;
}

export async function duplicateInvoice({
    ref,
    newDate,
    newDateIssued,
    selection,
    property,
    masterInvoices,
    api,
    units,
    navigate,
}: IInvoiceUtilsProps): Promise<void> {

    try {
        if (!property) {
            throw new Error("Invalid 'property' or 'year' value for duplication.");
        }
        const copiedInvoicePath = `/BodyCoperate/${property}`;
        const unitPath = `/BodyCoperate/${property}/Units`;

        if (masterInvoices.length === 0) {
            throw new Error("No master invoices to duplicate.");
        }

        const copiedInvoicesCollection = collection(
            db,
            copiedInvoicePath,
            "CopiedInvoices"
        );

        const updateUnitBalancesTransaction = async (transaction: any) => {
            const unitCollectionRef = collection(db, unitPath);
            const updates = [];
            const unitBalances: { [unitId: string]: number } = {};

            for (const masterInvoice of masterInvoices) {
                const { unitId, totalDue } = masterInvoice;
                const unitDocRef = doc(unitCollectionRef, unitId);
                const unitDoc = await transaction.get(unitDocRef);
                if (unitDoc.exists()) {
                    const currentBalance = unitDoc.data().balance || 0;
                    const copiedInvoice = { ...masterInvoice };
                    copiedInvoice.invoiceNumber = generateInvoiceNumber();
                    copiedInvoice.dueDate = newDate;
                    copiedInvoice.references = ref;
                    copiedInvoice.dateIssued = newDateIssued;
                    const newInvoiceRef = doc(copiedInvoicesCollection);
                    const generatedDocId = newInvoiceRef.id;
                    copiedInvoice.invoiceId = generatedDocId;
                    const absoluteCurrentBalance = Math.abs(currentBalance);

                    if (currentBalance < 0) {
                        copiedInvoice.totalPaid =
                            absoluteCurrentBalance > masterInvoice.totalDue
                                ? masterInvoice.totalDue
                                : absoluteCurrentBalance;
                    } else {
                        copiedInvoice.totalPaid = 0;
                    }
                    // Check if balance is less than zero
                    if (currentBalance < 0) {
                        // create customer receipt

                        const customerReceipt: IReceiptsPayments = {
                            unitId,
                            id: "",
                            date: newDateIssued,
                            reference: ref,
                            transactionType: "Customer Receipt",
                            description: "Credit Payment",
                            debit:
                                Math.abs(currentBalance) > totalDue
                                    ? masterInvoice.totalDue.toFixed(2)
                                    : Math.abs(currentBalance).toFixed(2),
                            credit: "",
                            balance: "",
                            propertyId: property || "",
                            invoiceNumber: generatedDocId,
                            rcp: generateRCPNumber(),
                            supplierId: "",
                        };
                        try {
                            if (property) {
                                await api.body.receiptPayments.create(
                                    customerReceipt,
                                    property,
                                    ""
                                );
                            }
                        } catch (error) {
                            console.log(error);
                        }

                        //IF CREDIT THAN CREATE ACCOUNTS TRANSACTION HERE FOR CUSTOMER RECIEPT
                        const accountTransactionReceipt: IAccountTransactions = {
                            id: "",
                            date: newDateIssued,
                            BankCustomerSupplier:
                                "unit " +
                                (units.find((u) => u.id === unitId)?.unitName || 0).toFixed(
                                    0
                                ),
                            reference: customerReceipt.rcp,
                            transactionType: "Customer Receipt",
                            description: selection,
                            debit:
                                Math.abs(currentBalance) > totalDue
                                    ? masterInvoice.totalDue
                                    : Math.abs(currentBalance),
                            credit: 0,
                            balance: 0,
                            accounntType: selection,
                        };
                        try {
                            if (property) {
                                await api.body.accountsTransactions.create(
                                    accountTransactionReceipt,
                                    property,
                                    ""
                                );
                            }
                        } catch (error) { }
                    } else {
                        console.error(`Unit document ${unitId} does not exist.`);
                    }

                    //get unit current balance
                    if (unitDoc.exists()) {
                        // Check if the unit's balance is already tracked
                        if (unitBalances[unitId] === undefined) {
                            unitBalances[unitId] = unitDoc.data().balance || 0;
                        }

                        const currentBalance = unitBalances[unitId]; // Get the current balance from the tracker
                        if (currentBalance >= 0) {
                            //invoice as transaction
                            const customerTransaction: ICustomerTransactions = {
                                id: "",
                                unitId: copiedInvoice.unitId,
                                date: newDateIssued,
                                reference: copiedInvoice.invoiceNumber,
                                transactionType: "Tax Invoice",
                                description: ref,
                                debit: masterInvoice.totalDue.toFixed(2),
                                credit: "",
                                balance: (totalDue + currentBalance).toFixed(2),
                                balanceAtPointOfTime: currentBalance.toFixed(2),
                                invId: copiedInvoice.invoiceId,
                            };
                            try {
                                if (property)
                                    await api.body.customer_transactions.create(
                                        customerTransaction,
                                        property,
                                        ""
                                    );
                            } catch (error) {
                                console.log(error);
                            }

                            // Accounts transaction for Tax invoice if current balance is equals to or more than 0
                            const accountTransactionTaxInvoice: IAccountTransactions = {
                                id: "",
                                date: newDateIssued,
                                BankCustomerSupplier:
                                    "unit " +
                                    (
                                        units.find((u) => u.id === unitId)?.unitName || 0
                                    ).toFixed(0),
                                reference: copiedInvoice.invoiceNumber,
                                transactionType: "Tax Invoice",
                                description: selection,
                                debit: 0,
                                credit: masterInvoice.totalDue,
                                balance: 0,
                                accounntType: selection,
                            };
                            try {
                                if (property) {
                                    await api.body.accountsTransactions.create(
                                        accountTransactionTaxInvoice,
                                        property,
                                        ""
                                    );
                                }
                            } catch (error) { }
                        } else if (currentBalance < 0) {
                            //create invoice as transaction
                            //tax invoice invoice
                            const customerTransactionTaxInvoice: ICustomerTransactions = {
                                id: "",
                                unitId: copiedInvoice.unitId,
                                date: newDateIssued,
                                reference: copiedInvoice.invoiceNumber,
                                transactionType: "Tax Invoice",
                                description: ref,
                                debit: masterInvoice.totalDue.toFixed(2),
                                credit: "",
                                balance: (totalDue + currentBalance).toFixed(2),
                                balanceAtPointOfTime: currentBalance.toFixed(2),
                                invId: copiedInvoice.invoiceId,
                            };
                            try {
                                if (property) {
                                    await api.body.customer_transactions.create(
                                        customerTransactionTaxInvoice,
                                        property,
                                        ""
                                    );
                                }
                            } catch (error) {
                                console.log(error);
                            }
                            // acccounts transaction for tax invoice if current balance is less than zero
                            const accountTransactionTaxInvoice: IAccountTransactions = {
                                id: "",
                                date: newDateIssued,
                                BankCustomerSupplier:
                                    "unit " +
                                    (
                                        units.find((u) => u.id === unitId)?.unitName || 0
                                    ).toFixed(0),
                                reference: copiedInvoice.invoiceNumber,
                                transactionType: "Tax Invoice",
                                description: selection,
                                debit: 0,
                                credit: masterInvoice.totalDue,
                                balance: 0,
                                accounntType: selection,
                            };
                            try {
                                if (property) {
                                    await api.body.accountsTransactions.create(
                                        accountTransactionTaxInvoice,
                                        property,
                                        ""
                                    );
                                }
                            } catch (error) { }
                        }
                    }

                    await setDoc(newInvoiceRef, copiedInvoice);
                    await updateDoc(newInvoiceRef, { invoiceId: generatedDocId });
                }
            }

            //updating unit new balances
            for (const masterInvoice of masterInvoices) {
                const { unitId, totalDue } = masterInvoice;
                const unitDocRef = doc(unitCollectionRef, unitId);
                const unitDoc = await transaction.get(unitDocRef);

                if (unitDoc.exists()) {
                    // Check if the unit's balance is already tracked
                    if (unitBalances[unitId] === undefined) {
                        unitBalances[unitId] = unitDoc.data().balance || 0;
                    }

                    const currentBalance = unitBalances[unitId]; // Get the current balance from the tracker
                    const newBalance = currentBalance + totalDue;
                    unitBalances[unitId] = newBalance;

                    updates.push({ ref: unitDocRef, data: { balance: newBalance } });
                }
            }
            // updates every operation add once
            for (const update of updates) {
                transaction.update(update.ref, update.data);
            }
        };


        await runTransaction(db, updateUnitBalancesTransaction);

        navigate('/c/body/body-corperate');
        window.location.reload();
    } catch (error) {
        console.error('Error duplicating invoice:', error);
    }

}