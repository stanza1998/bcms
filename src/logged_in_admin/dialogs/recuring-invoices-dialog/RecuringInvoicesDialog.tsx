import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../Dialogs";
import {
  IRecuringInvoice,
  defaultRecuringInvoice,
} from "../../../shared/models/invoices/RecuringInvoices";

interface ServiceDetails {
  description: string;
  price: number;
  total: number;
}

export const RecuringInvoicesDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);

  const [recuringInovice, setInvoice] = useState<IRecuringInvoice>({
    ...defaultRecuringInvoice,
  });

  // generate invoice number

  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    // Generate the invoice number
    const generateInvoiceNumber = () => {
      const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
      const formattedNumber = randomNumber.toString().padStart(4, "0"); // Pad the number with leading zeros if necessary
      const generatedInvoiceNumber = `INV000${formattedNumber}`; // Add the prefix "INV" to the number
      setInvoiceNumber(generatedInvoiceNumber); // Update the state with the generated invoice number
    };

    generateInvoiceNumber(); // Generate the invoice number when the component mounts

    // Clean up the effect (optional)
    return () => {
      // Any cleanup code if necessary
    };
  }, []);

  const [details, setDetails] = useState<ServiceDetails[]>([]);
  const totalPrice = details.reduce((sum, detail) => sum + detail.price, 0);

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);

  const addDetails = () => {
    // Create a new object with the retrieved values
    const newDetail: ServiceDetails = {
      description: description,
      price: price,
      total: total,
    };

    // Update the state by adding the new detail to the existing details array
    setDetails((prevDetails) => [...prevDetails, newDetail]);
    // Reset the input fields to their initial states
    setDescription("");
    setPrice(0);
    setTotal(0);
  };

  const totalAmount = details.reduce(
    (sum, details) => (sum += details.price),
    0
  );

  const prop = store.bodyCorperate.bodyCop.all
    .filter((body) => body.asJson.id === recuringInovice.propertyId)
    .map((body) => {
      return body.asJson.BodyCopName;
    });
  const uni = store.bodyCorperate.unit.all
    .filter((body) => body.asJson.id === recuringInovice.unitId)
    .map((body) => {
      return body.asJson.unitName;
    });

  const message = `We kindly request you to access the
   invoice for your property, ${prop}, Unit ${uni} ,
    through our secure system. The invoice number for this transaction is ${invoiceNumber}. 
    To do so, please log in to your account using the link provided. 
    Your prompt attention to this matter is greatly appreciated. 
    Should you require any further assistance, please do not hesitate to contact us. 
    Thank you. <a href="http://localhost:3000/">Login Now<a/>`;

  const subject = "Recuring Invoice ";
  const to = "stanzanarib@gmail.com";
  const name = "Stanza Narib";

  const currentDate = new Date();

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Update API
    try {
      if (store.bodyCorperate.recuringInvoice.selected) {
        const deptment = await api.body.recuringInvoice.update(recuringInovice);
        if (deptment)
          await store.bodyCorperate.recuringInvoice.load([deptment]);
        ui.snackbar.load({
          id: Date.now(),
          message: "Recuring Invoice updated!",
          type: "success",
        });
      } else {
        const total = totalAmount; // Set your desired default year here
        recuringInovice.totalPayment = total;
        recuringInovice.services = details;
        recuringInovice.invoiceNumber = invoiceNumber;
        recuringInovice.dateIssued = currentDate.toLocaleDateString();
        await api.body.recuringInvoice.create(recuringInovice);
        ui.snackbar.load({
          id: Date.now(),
          message: "RecuringInvoice created!",
          type: "success",
        });
      }
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update Recuring Invoice.",
        type: "danger",
      });
    }

    store.bodyCorperate.recuringInvoice.clearSelected();
    setLoading(false);
    store.bodyCorperate.recuringInvoice.clearSelected();
    setDetails([]);
    hideModalFromId(DIALOG_NAMES.BODY.RECURING_INVOICE);
    // await api.mail.sendMail(name, to, subject, message, "");
  };

  const onClear = () => {
    store.bodyCorperate.recuringInvoice.clearSelected();
  };

  useEffect(() => {
    if (store.bodyCorperate.recuringInvoice.selected)
      setInvoice(store.bodyCorperate.recuringInvoice.selected);
    else setInvoice({ ...defaultRecuringInvoice });

    return () => {};
  }, [store.bodyCorperate.recuringInvoice.selected]);

  useEffect(() => {
    const getData = async () => {
      await api.body.body.getAll();
      // await api.unit.getAll();
    };
    getData();
  }, [api.body.body, api.unit]);

  const [selectedBodyId, setSelectedBodyId] = useState("");

  const handleBodySelectChange = (event: any) => {
    const { value } = event.target;
    setSelectedBodyId(value);
    setInvoice({
      ...recuringInovice,
      propertyId: event.target.value,
    });
  };

  return (
    <div
      className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
      style={{ width: "100%" }}
    >
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
        onClick={onClear}
      ></button>

      <h3 className="uk-modal-title">Recuring Invoices</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <div
            className="uk-child-width-1-2@m uk-grid-small uk-grid-match"
            data-uk-grid
          >
            <div>
              <div
                className="uk-card uk-card-default uk-card-body"
                style={{ borderRadius: "10px" }}
              >
                <input
                  type="text"
                  className="uk-input"
                  style={{ width: "50%" }}
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <input
                  type="number"
                  className="uk-input uk-margin-left"
                  style={{ width: "46%" }}
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
                <button
                  className="uk-button primary uk-margin"
                  onClick={addDetails}
                >
                  Add to Services
                </button>
                <h4 className="uk-modal-title">
                  Total Amount: N$ {totalAmount.toFixed(2)}
                </h4>
                <table className="uk-table uk-table-small uk-table-divider">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th className="">Price</th>
                      <th className="uk-text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((details, index: number) => (
                      <tr key={index}>
                        <td style={{ textTransform: "uppercase" }}>
                          {details.description}
                        </td>
                        <td className="">N$ {details.price.toFixed(2)}</td>
                        <td className="uk-text-right">
                          N$ {details.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ borderRadius: "10px" }}>
              <form className="uk-form-stacked" onSubmit={onSave}>
                <div className="uk-card uk-card-default uk-card-body">
                  <div className="uk-margin">
                    <label
                      className="uk-form-label"
                      htmlFor="form-stacked-text"
                    >
                      Property
                    </label>
                    <div className="uk-form-controls">
                      <select
                        name=""
                        id=""
                        className="uk-input"
                        onChange={handleBodySelectChange}
                      >
                        <option value="">Select Property</option>
                        {store.bodyCorperate.bodyCop.all.map((property) => (
                          <option
                            value={property.asJson.id}
                            key={property.asJson.id}
                          >
                            {property.asJson.BodyCopName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="uk-margin">
                    <label
                      className="uk-form-label"
                      htmlFor="form-stacked-text"
                    >
                      Unit
                    </label>
                    <div className="uk-form-controls">
                      <select
                        name=""
                        id=""
                        className="uk-input"
                        value={recuringInovice.unitId} // Assuming you store the day in the state variable dayOfMonth
                        onChange={(e) =>
                          setInvoice({
                            ...recuringInovice,
                            unitId: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select Unit</option>
                        {store.bodyCorperate.unit.all
                          .filter(
                            (unit) => unit.asJson.bodyCopId === selectedBodyId
                          ) // Filter units by bodyId
                          .map((unit) => (
                            <option value={unit.asJson.id} key={unit.asJson.id}>
                              Unit {unit.asJson.unitName}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="uk-margin">
                    <label
                      className="uk-form-label"
                      htmlFor="form-stacked-text"
                    >
                      Monthly payment date.
                    </label>
                    <div className="uk-form-controls">
                      <select
                        className="uk-select"
                        value={recuringInovice.dayOfMonth} // Assuming you store the day in the state variable dayOfMonth
                        onChange={(e) =>
                          setInvoice({
                            ...recuringInovice,
                            dayOfMonth: Number(e.target.value),
                          })
                        }
                        required
                      >
                        <option value="">Select Day of the Month</option>
                        {Array.from(
                          { length: 31 },
                          (_, index) => index + 1
                        ).map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
