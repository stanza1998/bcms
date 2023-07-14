import { observer } from "mobx-react-lite";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAppContext } from "../../../../shared/functions/Context";
import { IInvoice, IService, defaultInvoice } from "../../../../shared/models/invoices/Invoices";
import { IBodyCop, defaultBodyCop } from "../../../../shared/models/bcms/BodyCorperate";
import { IUnit, defaultUnit } from "../../../../shared/models/bcms/Units";
import { db } from "../../../../shared/database/FirebaseConfig";
import { SuccessfulAction } from "../../../../shared/models/Snackbar";
import Loading from "../../../../shared/components/Loading";

interface ServiceDetails {
  description: string;
  price: number;
}

export const ViewInvoice = observer(() => {
  const { store, api, ui } = useAppContext();
  const { propertyId, id, yearId, monthId, invoiceId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      await api.body.invoice.getAll();
    };
    getData();
  }, [api.body.invoice]);

  const [invoice, setInvoice] = useState<IInvoice | undefined>({
    ...defaultInvoice,
  });

  const data = async () => {
    if (invoiceId) {
      const invoice = store.bodyCorperate.invoice.getById(invoiceId);
      setInvoice(invoice?.asJson);
    }
  };

  useEffect(() => {
    const data = async () => {
      if (invoiceId) {
        const invoice = store.bodyCorperate.invoice.getById(invoiceId);
        setInvoice(invoice?.asJson);
      }
    };
    data();
  }, [invoiceId, store.bodyCorperate.invoice]);

  const back = () => {
    navigate("/c/accounting/invoices");
  };

  //

  const [viewBody, setBody] = useState<IBodyCop | undefined>({
    ...defaultBodyCop,
  });
  const [unit, setUnit] = useState<IUnit | undefined>({
    ...defaultUnit,
  });
  // const [year, setYear] = useState<IFinancialYear | undefined>({
  //   ...defaultFinancialYear,
  // });
  // const [month, setMonth] = useState<IFinancialMonth | undefined>({
  //   ...defaultFinancialMonth,
  // });

  useEffect(() => {
    const data = async () => {
      if (propertyId || id || yearId || monthId) {
        await api.body.body.getAll();
        const property = store.bodyCorperate.bodyCop.getById(propertyId || "");
        setBody(property?.asJson);
        const unit = store.bodyCorperate.unit.getById(id || "");
        setUnit(unit?.asJson);
        // const month = store.bodyCorperate.financialMonth.getById(yearId || "");
        // setMonth(month?.asJson);
        // const year = store.bodyCorperate.financialYear.getById(monthId || "");
        // setYear(year?.asJson);
        await api.auth.loadAll();
      }
    };
    data();
  }, [
    api.auth,
    api.body.body,
    api.body.unit,
    id,
    monthId,
    propertyId,
    store.bodyCorperate.bodyCop,
    store.bodyCorperate.financialMonth,
    store.bodyCorperate.financialYear,
    store.bodyCorperate.unit,
    yearId,
  ]);

  //editing
  const [show, setShow] = useState(false);

  const showEdit = () => {
    setShow(true);
  };
  const hideEdit = () => {
    setShow(false);
  };

  //update due Date
  const currentDate1 = new Date().toISOString().slice(0, 10);

  const [newDate, setNewDate] = useState("");
  const [dateLoader, setDateLoader] = useState(false);

  const updateMaterial = async () => {
    if (invoiceId) {
      setDateLoader(true);
      const docRef = doc(db, "Invoices", invoiceId);
      const docSnap = await getDoc(docRef);
      await updateDoc(docRef, { dueDate: newDate });
      data();
      SuccessfulAction(ui);
      setDateLoader(false);
    } else {
      console.log("Material document does not exist");
      return null;
    }
  };

  //update details
  const [updatedDetails, setUpdatedDetails] = useState<IService[]>([]);

  const [description, setDescription] = useState("");

  const [price, setPrice] = useState(0);

  const addDetails = () => {
    // Create a new object with the retrieved values
    const newDetail: ServiceDetails = {
      description: description,
      price: price,
    };
    // Update the state by adding the new detail to the existing details array
    setUpdatedDetails((prevDetails) => [...prevDetails, newDetail]);
    // Reset the input fields to their initial states
    setDescription("");
    setPrice(0);
  };

  const totalPriceAmended = invoice?.serviceId.reduce(
    (total, service) => total + service.price,
    0
  );
  // amend total Price
  const [pricesUpdate, setPriceUpdate] = useState(false);
  const updatePrice = async () => {
    if (invoiceId) {
      setPriceUpdate(true);
      const docRef = doc(db, "Invoices", invoiceId);
      const docSnap = await getDoc(docRef);
      await updateDoc(docRef, { totalDue: totalPriceAmended });
      data();
      SuccessfulAction(ui);
      setPriceUpdate(false);
    } else {
      console.log("Material document does not exist");
      return null;
    }
  };

  const [detailsLoader, setDetailsLoader] = useState(false);
  const AddNewDetails = async () => {
    if (invoiceId) {
      setDetailsLoader(true);
      const docRef = doc(db, "Invoices", invoiceId);

      try {
        // Fetch the existing services array from the document
        const docSnap = await getDoc(docRef);
        const existingServices = docSnap.data()?.serviceId || [];

        // Combine the existing services array with the new services array
        const updatedServices = [...updatedDetails, ...existingServices];

        // Update the document with the updated services array
        await updateDoc(docRef, { serviceId: updatedServices });

        // Perform any other necessary actions after a successful update

        data();
        setUpdatedDetails([]);
        SuccessfulAction(ui);
      } catch (error) {
        console.log("Error updating document:", error);
      }

      setDetailsLoader(false);
    } else {
      console.log("Material document does not exist");
      return null;
    }
  };

  const [removeLoader, setReomveLoader] = useState(false);
  const removeService = async (indexToRemove: number) => {
    if (invoiceId) {
      setReomveLoader(true);
      const docRef = doc(db, "Invoices", invoiceId);

      try {
        // Fetch the existing services array from the document
        const docSnap = await getDoc(docRef);
        const existingServices = docSnap.data()?.serviceId || [];

        // Remove the service at the specified index
        existingServices.splice(indexToRemove, 1);

        // Update the document with the updated services array
        await updateDoc(docRef, { serviceId: existingServices });
        // Perform any other necessary actions after a successful update
        data();
        SuccessfulAction(ui);
      } catch (error) {
        console.log("Error updating document:", error);
      }

      setReomveLoader(false);
    } else {
      console.log("Material document does not exist");
      return null;
    }
  };

  //verifying invoice
  const [verificationLoader, setVerificationLoader] = useState(false);
  const verifyInvoice = async () => {
    if (invoiceId) {
      setVerificationLoader(true);
      const docRef = doc(db, "Invoices", invoiceId);
      const docSnap = await getDoc(docRef);
      await updateDoc(docRef, { verified: true });
      data();
      SuccessfulAction(ui);
      setVerificationLoader(false);
    } else {
      console.log("Material document does not exist");
      return null;
    }
  };

  //confirm invoice
  const [confirmInvoiceLoader, setConfirmInvoiceLoader] = useState(false);
  const confirmInvoice = async () => {
    if (invoiceId) {
      setConfirmInvoiceLoader(true);
      if (invoice?.pop) {
        const docRef = doc(db, "Invoices", invoiceId);
        const docSnap = await getDoc(docRef);
        await updateDoc(docRef, { confirmed: true });
        data();
        SuccessfulAction(ui);
        setConfirmInvoiceLoader(false);
      } else if (invoice?.pop === "") {
        ui.snackbar.load({
          id: Date.now(),
          message: "POP not uploaded.",
          type: "danger",
        });
        setConfirmInvoiceLoader(false);
      }
    } else {
      console.log("Material document does not exist");
      return null;
    }
  };

  //laader
  const [loaderS, setLoaderS] = useState(true);

  setTimeout(() => {
    setLoaderS(false);
  }, 1000);

  return (
    <div className="uk-section leave-analytics-page">
      {loaderS ? (
        <Loading />
      ) : (
        <div
          className="uk-container uk-container-large"
          style={{
            marginBottom: "10rem",
            border: "solid grey 3px",
            padding: "20px",
            margin: "30px",
            borderRadius: "6px",
          }}
        >
          <div className="section-toolbar uk-margin">
            <h4 className="section-heading uk-heading">
              {invoice?.invoiceNumber}
            </h4>
            <div className="controls">
              <div className="uk-inline">
                {show === true && (
                  <button
                    className="uk-button primary uk-margin-right"
                    type="button"
                    style={{ background: "red" }}
                    onClick={hideEdit}
                  >
                    Close
                  </button>
                )}
                {show === false && (
                  <>
                    {invoice?.verified === false && (
                      <button
                        className="uk-button primary uk-margin-right"
                        type="button"
                        style={{ background: "#000c37" }}
                        onClick={showEdit}
                      >
                        Edit
                      </button>
                    )}
                  </>
                )}
                {invoice?.verified === false && (
                  <button
                    className="uk-button primary uk-margin-right"
                    type="button"
                    style={{ background: "green" }}
                    onClick={verifyInvoice}
                  >
                    {verificationLoader ? (
                      <>Verifying invoice</>
                    ) : (
                      <>Verify Invoice</>
                    )}
                  </button>
                )}
                {invoice?.verified === true && (
                  <>
                    {invoice.confirmed === false && (
                      <>
                        <button
                          className="uk-button primary uk-margin-right"
                          type="button"
                          style={{ background: "orange" }}
                          onClick={confirmInvoice}
                        >
                          {confirmInvoiceLoader ? (
                            <>confirming...</>
                          ) : (
                            <>Confirm Invoice</>
                          )}
                        </button>
                      </>
                    )}
                    {invoice.confirmed === true && (
                      <p>Invoice successfully paid</p>
                    )}
                  </>
                )}
                <button
                  onClick={back}
                  className="uk-button primary"
                  type="button"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
          <div className="uk-section">
            <div className="uk-container uk-container-meduim">
              <div
                className="uk-child-width-1-2@m uk-grid-small uk-grid-match"
                data-uk-grid
              >
                <div>
                  <div className="uk-card-body">
                    <p
                      style={{ textTransform: "capitalize", fontWeight: "800" }}
                    >
                      {viewBody?.BodyCopName} <br />
                      {viewBody?.location} <br />
                      Unit {unit?.unitName} <br />
                      {store.user.all
                        .filter((u) => u.asJson.uid === unit?.ownerId)
                        .map((u) => {
                          return u.asJson.firstName + " " + u.asJson.lastName;
                        })}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="uk-card-body">
                    <div className="uk-text-right">
                      <img
                        style={{ width: "60%", height: "60%" }}
                        src={process.env.PUBLIC_URL + "/icon1.png"}
                        alt="Phlo"
                      />
                    </div>
                    <p
                      className="uk-text-right"
                      style={{ textTransform: "capitalize", fontWeight: "800" }}
                    >
                      {" "}
                      Number: {invoice?.invoiceNumber} <br />
                      Date: {invoice?.dateIssued} <br />
                      Due Date: {invoice?.dueDate} <br />
                      Total Due: N$ {invoice?.totalDue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              {show === true && (
                <div>
                  <div>
                    <label htmlFor="">Adjust Due</label> <br /> <br />
                    <input
                      type="date"
                      className="uk-input uk-form-small uk-margin-right"
                      style={{ width: "50%" }}
                      min={currentDate1}
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                    <button
                      className="uk-button primary"
                      onClick={updateMaterial}
                    >
                      {dateLoader ? <>Updating due date....</> : <>Update</>}
                    </button>
                  </div>{" "}
                  <br />
                  <label htmlFor="">Add Details</label> <br /> <br />
                  <input
                    type="text"
                    className="uk-input uk-form-small uk-margin-right"
                    placeholder="Description"
                    style={{ width: "50%" }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <input
                    type="number"
                    style={{ width: "45%" }}
                    className="uk-input uk-form-small uk-margin-left"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                  <button
                    className="uk-button primary uk-margin"
                    onClick={addDetails}
                  >
                    Add to List
                  </button>
                  <br />
                  Total Due: N$ {totalPriceAmended?.toFixed(2)} <br />
                  {totalPriceAmended !== invoice?.totalDue && (
                    <>
                      <br />
                      <button
                        style={{ background: "red" }}
                        className="uk-button primary"
                        onClick={updatePrice}
                      >
                        {pricesUpdate ? (
                          <>Updating price...</>
                        ) : (
                          <>Please Update Price</>
                        )}
                      </button>

                      <p style={{ color: "red" }}>Total Due is not updated</p>
                    </>
                  )}
                  <br />
                  {updatedDetails.length > 0 && (
                    <>
                      <table className="uk-table uk-table-small uk-table-divider">
                        <thead>
                          <tr>
                            <th>Description</th>
                            <th className="uk-text-center">Price</th>
                            <th className="uk-text-right">Total Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {updatedDetails.map((details, index) => (
                            <tr key={index}>
                              <td style={{ textTransform: "uppercase" }}>
                                {details.description}
                              </td>
                              <td className="uk-text-center">
                                N$ {details.price.toFixed(2)}
                              </td>
                              <td className="uk-text-right">
                                N$ {details.price.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <br />
                      <button
                        className="uk-button primary"
                        onClick={AddNewDetails}
                      >
                        {detailsLoader ? (
                          <>Adding new service details...</>
                        ) : (
                          <>Add new Service Details</>
                        )}
                      </button>
                      <hr />
                    </>
                  )}
                </div>
              )}
              <table className="uk-table uk-table-small uk-table-divider">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th className="uk-text-center">Price</th>
                    <th className="uk-text-right">Total Price</th>
                    {show === true && <td className="uk-text-right">Action</td>}
                  </tr>
                </thead>
                <tbody>
                  {invoice?.serviceId.map((details, index) => (
                    <tr key={index}>
                      <td style={{ textTransform: "uppercase" }}>
                        {details.description}
                      </td>
                      <td className="uk-text-center">
                        N$ {details.price.toFixed(2)}
                      </td>
                      <td className="uk-text-right">
                        N$ {details.price.toFixed(2)}
                      </td>
                      {show === true && (
                        <td className="uk-text-right">
                          <button
                            className="uk-button primary"
                            style={{ background: "red" }}
                            onClick={() => removeService(index)}
                          >
                            {removeLoader ? <>removing...</> : <>Remove</>}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <hr />
          <div className="section-toolbar uk-margin">
            <div className="section-heading uk-heading">
              <div>
                {viewBody?.bankName} <br />
                Account Name : {viewBody?.accountName} <br />
                Account Number : {viewBody?.accountNumber} <br />
                Branch : {viewBody?.branchName} <br />
                Branch Code : {viewBody?.branchCode} <br />
                Account Style : {viewBody?.accountStyle} <br />
                SWIFT : {viewBody?.swift}
              </div>
            </div>
            <div className="controls">
              <div className="uk-inline">
                <div className="uk-text-right">
                  Total Discount: N$0.00 <br />
                  Total Exclusive: N${invoice?.totalDue.toFixed(2)} <br />
                  Total VAT: N$0.00
                  <br />
                  <hr />
                  Sub Total: N${invoice?.totalDue.toFixed(2)}
                  <hr />
                </div>
              </div>
            </div>
          </div>
          <hr />
        </div>
      )}
    </div>
  );
});
