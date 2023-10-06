import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";
import { useNavigate, useParams } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import {
  IBodyCop,
  defaultBodyCop,
} from "../../../../../shared/models/bcms/BodyCorperate";
import { IUnit, defaultUnit } from "../../../../../shared/models/bcms/Units";
import Modal from "../../../../../shared/components/Modal";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import showModalFromId, {
  hideModalFromId,
} from "../../../../../shared/functions/ModalShow";
import { UnitCard } from "./unit-details/UnitCard";
import Loading from "../../../../../shared/components/Loading";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  runTransaction,
} from "firebase/firestore";
import { db } from "../../../../../shared/database/FirebaseConfig";
import { FailedAction } from "../../../../../shared/models/Snackbar";
import { IInvoice } from "../../../../../shared/models/invoices/Invoices";
import GridViewIcon from "@mui/icons-material/GridView";
import { nadFormatter } from "../../../../shared/NADFormatter";
import { IReceiptsPayments } from "../../../../../shared/models/receipts-payments/ReceiptsPayments";
import { ICustomerTransactions } from "../../../../../shared/models/transactions/customer-transactions/CustomerTransactionModel";
import UnitsGrid from "./grid/UnitsGrid";

export const ViewUnit = observer(() => {
  const { store, api, ui } = useAppContext();
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [newDate, setNewDate] = useState("");
  const [newDateIssued, setNewDateIssued] = useState("");
  const [ref, setRef] = useState("");
  const me = store.user.meJson;
  const [selection, setSelection] = useState<string>("");

  const [viewBody, setBody] = useState<IBodyCop | undefined>({
    ...defaultBodyCop,
  });

  useEffect(() => {
    const getData = async () => {
      if (!propertyId) {
        window.alert("Cannot find ");
      } else {
        if (!me?.property) return;
        await api.body.body.getAll();
        const unit = store.bodyCorperate.bodyCop.getById(propertyId);
        setBody(unit?.asJson);
        await api.unit.getAll(me?.property);
        await api.body.invoice.getAll(me?.property);
        await api.auth.loadAll();
      }
    };
    getData();
  }, [
    api.auth,
    api.body.body,
    api.body.invoice,
    api.unit,
    me?.property,
    propertyId,
    store.bodyCorperate.bodyCop,
  ]);

  const [masterInvoices, setMasterInvoices] = useState<IInvoice[]>([]);

  useEffect(() => {
    const getData = async () => {
      const masterInvoices = store.bodyCorperate.invoice.all
        .filter((inv) => inv.asJson.propertyId === propertyId)
        .map((inv) => {
          return inv.asJson;
        });
      setMasterInvoices(masterInvoices);
      if (me?.property) await api.body.account.getAll(me.property);
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId, store.bodyCorperate.invoice.all]);

  const back = () => {
    navigate("/c/body/body-corperate");
  };

  const [unit, _setUnit] = useState<IUnit>({
    ...defaultUnit,
  });

  const [loading, setLoading] = useState(false);
  const [loadingS, setLoadingS] = useState(true);

  const resetMaterial = () => {
    _setUnit({ ...defaultUnit });
  };

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!me?.property) return;
    try {
      if (store.bodyCorperate.unit.selected) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const supp = await api.unit.update(unit, me.property);
        await store.bodyCorperate.unit.load();
        ui.snackbar.load({
          id: Date.now(),
          message: "unit updated!",
          type: "success",
        });
      } else {
        // Add the default category ID to the tradingType object
        if (viewBody?.id) unit.bodyCopId = viewBody?.id;

        await api.unit.create(unit, me.property);
        // if (supp) await store.inventory.tradingCategories.load([supp]);
        ui.snackbar.load({
          id: Date.now(),
          message: "unit created!",
          type: "success",
        });
      }
      resetMaterial();
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update tradingCategories.",
        type: "danger",
      });
    }
    store.bodyCorperate.unit.clearSelected();
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.BODY.BODY_UNIT_DIALOG);
  };

  useEffect(() => {
    if (store.bodyCorperate.unit.selected)
      _setUnit(store.bodyCorperate.unit.selected);
    else _setUnit({ ...defaultUnit });
    return () => {};
  }, [store.bodyCorperate.unit.selected]);

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.BODY.BODY_UNIT_DIALOG);
  };

  const clear = () => {
    store.bodyCorperate.unit.clearSelected();
    resetMaterial();
  };

  //filter
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  const filteredUnits = store.bodyCorperate.unit.all
   .sort((a, b) => a.asJson.unitName - b.asJson.unitName).map((unit) => {return unit.asJson});

  const [loadingF, setLoadingF] = useState(false);

  const generateInvoiceNumber = () => {
    const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
    const formattedNumber = randomNumber.toString().padStart(4, "0"); // Pad the number with leading zeros if necessary
    const generatedInvoiceNumber = `INV000${formattedNumber}`; // Add the prefix "INV" to the number
    return generatedInvoiceNumber;
  };
  const generateRCPNumber = () => {
    const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
    const formattedNumber = randomNumber.toString().padStart(4, "0"); // Pad the number with leading zeros if necessary
    const generatedInvoiceNumber = `RCP000${formattedNumber}`; // Add the prefix "INV" to the number
    return generatedInvoiceNumber;
  };

  //duplicate function
  const onDupicate = () => {
    showModalFromId(DIALOG_NAMES.BODY.VIEW_INVOICE);
  };

  //very important feature, needs focus and proper mentainance.
  //sending email notification is still missing in the duplicate function (important)
  const duplicated = async () => {
    setLoadingF(true);
    try {
      if (!me?.property || !me?.year) {
        throw new Error("Invalid 'property' or 'year' value for duplication.");
      }
      const copiedInvoicePath = `/BodyCoperate/${me.property}/FinancialYear/${me.year}`;
      const unitPath = `/BodyCoperate/${me.property}/Units`;
      //check if matser inivoices are 0
      if (masterInvoices.length === 0) {
        throw new Error("No master invoices to duplicate.");
      }

      //copied invoices operation
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
                propertyId: me.property || "",
                invoiceNumber: generatedDocId,
                rcp: generateRCPNumber(),
                supplierId: "",
              };
              try {
                if (me.property && me.year) {
                  await api.body.receiptPayments.create(
                    customerReceipt,
                    me.property,
                    me.year
                  );
                }
              } catch (error) {
                console.log(error);
              }

              //IF CREDIT THAN CREATE TRANSACTION HERE
            } else {
              console.error(`Unit document ${unitId} does not exist.`);
            }

            //CREATE TRANSACTION HERE
            //get unit current balance
            if (unitDoc.exists()) {
              // Check if the unit's balance is already tracked
              if (unitBalances[unitId] === undefined) {
                unitBalances[unitId] = unitDoc.data().balance || 0;
              }

              const currentBalance = unitBalances[unitId]; // Get the current balance from the tracker

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
                if (me?.property && me?.year)
                  await api.body.customer_transactions.create(
                    customerTransaction,
                    me.property,
                    me.year
                  );
              } catch (error) {
                console.log(error);
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
        //updates every operation add once
        for (const update of updates) {
          transaction.update(update.ref, update.data);
        }
      };

      await runTransaction(db, updateUnitBalancesTransaction);

      hideModalFromId(DIALOG_NAMES.BODY.VIEW_INVOICE);
      navigate("/c/body/body-corperate");
      window.location.reload();
    } catch (error) {
      console.error("Error duplicating invoice:", error);
      FailedAction(ui);
    } finally {
      setLoadingF(false);
    }
  };

  setTimeout(() => {
    setLoadingS(false);
  }, 1000);

  const unitInfo = (id: string) => {
    navigate(`/c/body/body-corperate/${propertyId}/${id}`);
  };

  return (
    <div className="uk-section leave-analytics-page sales-ViewUnit sales-order">
      {loadingS ? (
        <Loading />
      ) : (
        <div className="uk-container uk-container-large">
          <div className="section-toolbar uk-margin">
            <p
              className="section-heading uk-heading"
              style={{ textTransform: "uppercase", cursor: "pointer" }}
              onClick={back}
            >
              {viewBody?.BodyCopName}
            </p>
            <div className="controls">
              <div className="uk-inline">
                <span
                  // onClick={duplicated}
                  onClick={onDupicate}
                  data-uk-tooltip="Generate unit-specific invoices from the master invoice for the current month"
                  style={{ cursor: "pointer" }}
                  data-uk-icon="copy"
                  className="uk-margin-right"
                ></span>

                <button
                  className="uk-button primary uk-margin-right"
                  type="button"
                  onClick={onCreate}
                >
                  Add Unit
                </button>

                <button
                  className="uk-button primary"
                  type="button"
                  onClick={back}
                >
                  back
                </button>
              </div>
            </div>
          </div>
          <div>
            {/* Search Input */}
            {loadingF && <h1>Loading...</h1>}
            <input
              type="text"
              name=""
              id=""
              className="uk-input uk-form-small uk-margin"
              placeholder="Search by Unit Name"
              style={{ width: "30%" }}
              value={searchQuery}
              onChange={handleSearchChange}
            />

            {/* Units */}
            <div
              className="uk-card uk-card-default uk-card-body uk-width-1-1@m"
              style={{
                backgroundPosition: "right",
                backgroundSize: "35%",
                backgroundRepeat: "no-repeat",
              }}
            >
              <UnitsGrid data={filteredUnits}/>
              {/* <table className="uk-table uk-table-divider">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Units</th>
                    <th>Owner Name</th>
                    <th>Owner Email</th>
                    <th>Owner Phone</th>
                    <th>Balance</th>
                    <th className="uk-text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUnits.map((unit, index) => (
                    <tr key={unit.asJson.id}>
                      <td>{index + 1}</td>
                      <td>Unit {unit.asJson.unitName}</td>
                      <td>
                        {store.user.all
                          .filter(
                            (user) => user.asJson.uid === unit.asJson.ownerId
                          )
                          .map((user) => user.firstName + " " + user.lastName)}
                      </td>
                      <td>
                        {store.user.all
                          .filter(
                            (user) => user.asJson.uid === unit.asJson.ownerId
                          )
                          .map((user) => user.email)}
                      </td>
                      <td>
                        {store.user.all
                          .filter(
                            (user) => user.asJson.uid === unit.asJson.ownerId
                          )
                          .map((user) => {
                            return "+264" + user.cellphone;
                          })}
                      </td>
                      <td
                        style={{
                          background:
                            unit.asJson.balance >= 0 ? "green" : "red",
                          color: "white",
                        }}
                      >
                        {nadFormatter.format(unit.asJson.balance)}
                      </td>
                      <td className="uk-text-right">
                        <span
                          style={{
                            background: "#000c37",
                            color: "white",
                            paddingLeft: "16px",
                            paddingRight: "20px",
                            paddingTop: "2px",
                            paddingBottom: "6px",
                            borderRadius: "2rem",
                          }}
                        >
                          <UnitCard key={unit.asJson.id} unit={unit.asJson} />
                          <span
                            onClick={() => unitInfo(unit.asJson.id)}
                            style={{ cursor: "pointer" }}
                          >
                            {" "}
                            <GridViewIcon />{" "}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table> */}
            </div>
          </div>
        </div>
      )}

      <Modal modalId={DIALOG_NAMES.BODY.BODY_UNIT_DIALOG}>
        <div className="uk-modal-dialog uk-modal-body margin-auto-vertical">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            onClick={clear}
          ></button>

          <h3 className="uk-modal-title"> Unit Details</h3>

          <div className="dialog-content uk-position-relative">
            <div className="reponse-form">
              <form className="uk-form-stacked" onSubmit={onSave}>
                <div
                  className="uk-grid-small uk-child-width-1-1@m"
                  data-uk-grid
                >
                  <div className="uk-width-1-1@m">
                    <label
                      className="uk-form-label"
                      htmlFor="form-stacked-text"
                    >
                      Unit Number
                    </label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input uk-form-small"
                        type="Number"
                        // placeholder="Type"
                        value={unit.unitName}
                        onChange={(e) =>
                          _setUnit({
                            ...unit,
                            unitName: Number(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="uk-width-1-1@m">
                    <label
                      className="uk-form-label"
                      htmlFor="form-stacked-text"
                    >
                      Select Owner
                    </label>
                    <div className="uk-form-controls">
                      <select
                        name=""
                        className="uk-input uk-form-small"
                        id=""
                        value={unit.ownerId}
                        onChange={(e) =>
                          _setUnit({
                            ...unit,
                            ownerId: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Owner</option>
                        {store.user.all
                          .filter((user) => user.role === "Owner")
                          .map((owner) => (
                            <option value={owner.uid}>
                              {owner.firstName} {owner.lastName}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="footer uk-margin">
                    <button className="uk-button secondary uk-modal-close">
                      Cancel
                    </button>
                    <button className="uk-button primary" type="submit">
                      Save
                      {loading && <div data-uk-spinner="ratio: .5"></div>}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
      <Modal modalId={DIALOG_NAMES.BODY.VIEW_INVOICE}>
        <div
          className="uk-modal-dialog uk-modal-body margin-auto-vertical"
          style={{ width: "100%" }}
        >
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            onClick={clear}
          ></button>
          <h3 className="uk-modal-title">
            Duplicate{" "}
            {store.bodyCorperate.bodyCop.all
              .filter((prop) => prop.asJson.id === propertyId)
              .map((prop) => {
                return prop.asJson.BodyCopName;
              })}{" "}
            invoices from master invoices of each unit below.
          </h3>
          {loadingF && <div data-uk-spinner></div>}
          <div className="uk-child-width-expand@s" data-uk-grid>
            <div className="uk-grid-item-match">
              <div>
                <h4 className="uk-modal-title">Units</h4>
                {store.bodyCorperate.unit.all
                  .filter((unit) => unit.asJson.bodyCopId === propertyId)
                  .map((unit) => (
                    <ul
                      className="uk-list uk-list-striped uk-list-small"
                      key={unit.asJson.id}
                    >
                      <li>Unit {unit.asJson.unitName}</li>
                    </ul>
                  ))}
              </div>
            </div>
            <div>
              <h4 className="uk-modal-title">Set New Due Date</h4>
              <label htmlFor="">Reference</label>
              <br />
              <br />
              <input
                type="text"
                className="uk-input "
                value={ref}
                onChange={(e) => setRef(e.target.value)}
              />
              <br />
              <br />
              <label htmlFor="">Current Date</label>
              <br />
              <br />
              <input
                type="date"
                className="uk-input "
                value={newDateIssued}
                onChange={(e) => setNewDateIssued(e.target.value)}
              />
              <br />
              <br />
              <label htmlFor="">New Due Date</label>
              <br />
              <br />
              <input
                type="date"
                className="uk-input "
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
              <br />
              <br />
              <label htmlFor="">select sccount</label>
              <br />
              <br />
              <select className="uk-input" onChange={(e) => setSelection}>
                <option>select account</option>
                {store.bodyCorperate.account.all.map((a) => (
                  <option value={a.asJson.id}>{a.asJson.name}</option>
                ))}
              </select>
              <button
                onClick={duplicated}
                disabled={loadingF}
                style={{ backgroundColor: loadingF ? "grey" : "" }}
                className="uk-button primary uk-margin"
              >
                Duplicate
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
});

// const duplicated = async () => {
//   if (!me?.property && !me?.year) return;
//   const copiedInvoicePath = `/BodyCoperate/${me.property}/FinancialYear/${me.year}`;

//   const unitPath = `/BodyCoperate/${me.property}/Units`;

//   if (masterInvoices.length > 0) {
//     try {
//       setLoadingF(true);
//       const copiedInvoicesCollection = collection(
//         db,
//         copiedInvoicePath,
//         "CopiedInvoices"
//       );

//       // Firestore transaction to update unit balances
//       const updateUnitBalancesTransaction = async (transaction: any) => {
//         const unitCollectionRef = collection(db, unitPath);
//         const updates = []; // Array to store update operations

//         for (const masterInvoice of masterInvoices) {
//           const { unitId, totalDue } = masterInvoice;

//           // Get the unit document reference
//           const unitDocRef = doc(unitCollectionRef, unitId);

//           // Retrieve the unit document data
//           const unitDoc = await transaction.get(unitDocRef);

//           // Calculate the new balance by adding totalDue
//           const newBalance = unitDoc.data().balance + totalDue;

//           // Prepare the update operation and store it in the updates array
//           updates.push({
//             ref: unitDocRef,
//             data: { balance: newBalance },
//           });
//         }
//         // Perform all the update operations outside the loop
//         for (const update of updates) {
//           transaction.update(update.ref, update.data);
//         }
//       };
//       // Run the transaction
//       await runTransaction(db, updateUnitBalancesTransaction);
//       for (const masterInvoice of masterInvoices) {
//         try {
//           const copiedInvoice = { ...masterInvoice };
//           copiedInvoice.invoiceNumber = generateInvoiceNumber();
//           copiedInvoice.dueDate = newDate;
//           copiedInvoice.references = ref;
//           copiedInvoice.dateIssued = newDateIssued;
//           const newInvoiceRef = doc(copiedInvoicesCollection);
//           await setDoc(newInvoiceRef, copiedInvoice);
//           const generatedDocId = newInvoiceRef.id;
//           copiedInvoice.invoiceId = generatedDocId;
//           await updateDoc(newInvoiceRef, { invoiceId: generatedDocId });
//           console.log("Invoice duplicated and saved:", copiedInvoice);
//         } catch (error) {
//           console.log("Error duplicating invoice:", error);
//           FailedAction(ui);
//         }
//       }
//       setLoadingF(false);
//     } catch (error) {
//       console.log(error);
//     }
//   } else {
//     alert("No master invoices");
//   }
//   setLoadingF(false);
//   hideModalFromId(DIALOG_NAMES.BODY.VIEW_INVOICE);
//   navigate("/c/body/body-corperate");
//   window.location.reload();
// };

// const duplicated = async () => {
//   setLoadingF(true);
//   try {
//     if (!me?.property || !me?.year) {
//       throw new Error("Invalid 'property' or 'year' value for duplication.");
//     }

//     const copiedInvoicePath = `/BodyCoperate/${me.property}/FinancialYear/${me.year}`;
//     const unitPath = `/BodyCoperate/${me.property}/Units`;

//     if (masterInvoices.length === 0) {
//       throw new Error("No master invoices to duplicate.");
//     }

//     const copiedInvoicesCollection = collection(
//       db,
//       copiedInvoicePath,
//       "CopiedInvoices"
//     );

//     const updateUnitBalancesTransaction = async (
//       transaction: Transaction
//     ) => {
//       const unitCollectionRef = collection(db, unitPath);
//       const updates = [];

//       for (const masterInvoice of masterInvoices) {
//         const { unitId, totalDue } = masterInvoice;
//         const unitDocRef = doc(unitCollectionRef, unitId);
//         const unitDoc = await transaction.get(unitDocRef);

//         if (unitDoc.exists()) {
//           // Check if the document exists
//           const currentBalance = unitDoc.data().balance || 0; // Use default value if balance is undefined
//           const newBalance = currentBalance + totalDue;

//           updates.push({ ref: unitDocRef, data: { balance: newBalance } });
//         } else {
//           console.error(`Unit document ${unitId} does not exist.`);
//         }
//       }

//       for (const update of updates) {
//         transaction.update(update.ref, update.data);
//       }
//     };

//     await runTransaction(db, updateUnitBalancesTransaction);

//     for (const masterInvoice of masterInvoices) {
//       const copiedInvoice = { ...masterInvoice };
//       copiedInvoice.invoiceNumber = generateInvoiceNumber();
//       copiedInvoice.dueDate = newDate;
//       copiedInvoice.references = ref;
//       copiedInvoice.dateIssued = newDateIssued;

//       const newInvoiceRef = doc(copiedInvoicesCollection);
//       await setDoc(newInvoiceRef, copiedInvoice);
//       const generatedDocId = newInvoiceRef.id;
//       copiedInvoice.invoiceId = generatedDocId;
//       await updateDoc(newInvoiceRef, { invoiceId: generatedDocId });

//       console.log("Invoice duplicated and saved:", copiedInvoice);
//     }

//     hideModalFromId(DIALOG_NAMES.BODY.VIEW_INVOICE);
//     navigate("/c/body/body-corperate");
//     window.location.reload();
//   } catch (error) {
//     console.error("Error duplicating invoice:", error);
//     FailedAction(ui);
//   } finally {
//     setLoadingF(false);
//   }
// };
