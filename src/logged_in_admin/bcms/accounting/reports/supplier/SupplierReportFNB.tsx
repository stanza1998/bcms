import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../../../shared/functions/Context";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

interface Statement {
  date: string;
  reference: string;
  transactionType: string;
  description: string;
  debit: string;
  credit: string;
  balance: number;
  id: string;
  supplierId: string;
  propertyId: string;
  unitId: string;
  invoiceNumber: string;
}

interface IProp {
  data: Statement[];
}

export const SupplierReportsFNB = observer(() => {
  const { store, api } = useAppContext();
  const navigate = useNavigate();
  const [propertyId, setSetPropertyId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const me = store.user.meJson;

  const back = () => {
    navigate("/c/accounting/statements");
  };

  useEffect(() => {
    const getData = async () => {
      if (me?.property && !me?.year && !me?.month)
        await api.body.fnb.getAll(me.property, me.year, me.month);
      if (me?.property) await api.body.supplier.getAll(me.property);
      if (me?.property && me.year)
        await api.body.supplierInvoice.getAll(me.property, me.year);
      await api.body.body.getAll();
    };
    getData();
  }, [
    api.body.body,
    api.body.fnb,
    api.body.supplier,
    api.body.supplierInvoice,
    me?.property,
    me?.year,
    me?.month,
  ]);

  const properties = store.bodyCorperate.bodyCop.all.map((p) => {
    return p.asJson;
  });
  const suppliers = store.bodyCorperate.supplier.all.map((p) => {
    return p.asJson;
  });

  const record = store.bodyCorperate.fnb.all
    .filter(
      (r) =>
        r.asJson.propertyId !== "" &&
        r.asJson.unitId === "" &&
        r.asJson.accountId === "" &&
        r.asJson.transferId === "" &&
        r.asJson.supplierId !== "" &&
        r.asJson.allocated === true
    )
    .map((r) => {
      return r.asJson;
    });

  //replace with supplier invoice
  const recordInvoiceNumber = record.map((r) => {
    return r.invoiceNumber;
  });

  //replace with supplier invoice
  const supplier_invoices = store.bodyCorperate.supplierInvoice.all
    .filter((inv) => recordInvoiceNumber.includes(inv.asJson.invoiceNumber))
    .map((inv) => {
      return inv.asJson;
    });

  const [combinedData, setCombinedData] = useState<Statement[]>([]);

  // combine invoices and transaction in the same array.
  const combine = () => {
    const dataMap: Record<string, Statement[]> = {};

    // Group record data by invoiceNumber
    record.forEach((recordItem) => {
      if (!dataMap[recordItem.invoiceNumber]) {
        dataMap[recordItem.invoiceNumber] = [];
      }

      dataMap[recordItem.invoiceNumber].push({
        date: recordItem.date,
        reference: recordItem.rcp,
        transactionType: "Supplier Payment",
        description: recordItem.description,
        credit: "",
        debit: recordItem.amount.toFixed(2),
        balance: 0,
        supplierId: recordItem.supplierId,
        unitId: recordItem.unitId,
        invoiceNumber: recordItem.invoiceNumber,
        id: recordItem.id,
        propertyId: recordItem.propertyId,
      });
    });

    // Group invoice data by invoiceNumber
    supplier_invoices.forEach((invoiceItem) => {
      if (!dataMap[invoiceItem.invoiceNumber]) {
        dataMap[invoiceItem.invoiceNumber] = [];
      }

      dataMap[invoiceItem.invoiceNumber].push({
        date: invoiceItem.dateIssued,
        reference: invoiceItem.invoiceNumber,
        transactionType: "Supplier Invoice",
        description: invoiceItem.references,
        credit: invoiceItem.totalDue.toFixed(2),
        debit: "",
        balance: invoiceItem.totalDue,
        invoiceNumber: invoiceItem.invoiceNumber,
        id: invoiceItem.invoiceId,
        supplierId: invoiceItem.supplierId,
        unitId: "",
        propertyId: invoiceItem.propertyId,
      });
    });

    // Flatten grouped data into a single array
    const comData = Object.values(dataMap).flatMap((group) => group);

    // Calculate balances for supplier payments
    const supplierPayments = comData.filter(
      (transaction) => transaction.transactionType === "Supplier Payment"
    );

    const supplierInvoiceCreditMap: Record<string, number> = {};

    supplierPayments.forEach((payment) => {
      const { invoiceNumber, debit } = payment;
      supplierInvoiceCreditMap[invoiceNumber] =
        (supplierInvoiceCreditMap[invoiceNumber] || 0) + parseFloat(debit);
    });

    supplierPayments.forEach((payment) => {
      const matchingInvoice = comData.find(
        (transaction) =>
          transaction.transactionType === "Supplier Invoice" &&
          transaction.invoiceNumber === payment.invoiceNumber
      );

      if (matchingInvoice) {
        payment.balance =
          (supplierInvoiceCreditMap[payment.invoiceNumber] || 0) +
          parseFloat(matchingInvoice.credit);
      }
    });

    // Update the state with the combined data
    setCombinedData(comData);
  };

  //filter from and to date
  const filteredData = combinedData.filter((statement) => {
    const statementDate = new Date(statement.date);

    if (dateFrom && dateTo) {
      if (statement.transactionType === "Supplier Payment") {
        // Find tax invoices with the same invoiceNumber and date within the range
        const relatedInvoices = combinedData.filter(
          (invoice) =>
            invoice.transactionType === "Supplier Invoice" &&
            invoice.invoiceNumber === statement.invoiceNumber &&
            new Date(invoice.date) >= dateFrom &&
            new Date(invoice.date) <= dateTo
        );

        return relatedInvoices.length > 0;
      } else {
        return statementDate >= dateFrom && statementDate <= dateTo;
      }
    } else if (dateFrom && !dateTo) {
      if (statement.transactionType === "Supplier Payment") {
        // Find tax invoices with the same invoiceNumber and date greater than dateFrom
        const relatedInvoices = combinedData.filter(
          (invoice) =>
            invoice.transactionType === "Supplier Invoice" &&
            invoice.invoiceNumber === statement.invoiceNumber &&
            new Date(invoice.date) >= dateFrom
        );

        return relatedInvoices.length > 0;
      } else {
        return statementDate >= dateFrom;
      }
    } else if (!dateFrom && dateTo) {
      if (statement.transactionType === "Supplier Payment") {
        // Find tax invoices with the same invoiceNumber and date less than dateTo
        const relatedInvoices = combinedData.filter(
          (invoice) =>
            invoice.transactionType === "Supplier Invoice" &&
            invoice.invoiceNumber === statement.invoiceNumber &&
            new Date(invoice.date) <= dateTo
        );

        return relatedInvoices.length > 0;
      } else {
        return statementDate <= dateTo;
      }
    } else {
      return true;
    }
  });

  const handleDateFilterChange = (from: Date | null, to: Date | null) => {
    setDateFrom(from);
    setDateTo(to);
  };

  const groupedData = [];
  let currentIndex = 0;

  while (currentIndex < filteredData.length) {
    const currentStatement = filteredData[currentIndex];

    // Find all statements with the same invoice number
    const statementsWithSameInvoice = [currentStatement];
    for (let i = currentIndex + 1; i < filteredData.length; i++) {
      if (filteredData[i].invoiceNumber === currentStatement.invoiceNumber) {
        statementsWithSameInvoice.push(filteredData[i]);
      } else {
        break;
      }
    }

    // Sort the statements with the same invoice number based on transaction type
    const sortedStatements = statementsWithSameInvoice.sort((a, b) => {
      if (a.transactionType === "Supplier Invoice") {
        return -1; // Tax Invoices come before Customer Receipts
      } else if (b.transactionType === "Supplier Invoice") {
        return 1;
      }
      return 0;
    });

    groupedData.push(...sortedStatements);
    currentIndex += statementsWithSameInvoice.length;
  }

  const specificCustomerRecord = groupedData.filter(
    (f) => f.propertyId === propertyId && f.supplierId === supplierId
  );

  const clearFilter = () => {
    setSupplierId("");
    setDateFrom(null);
    setDateTo(null);
  };

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">
            First National Bank / Customer Transaction Report
          </h4>
          <div className="controls">
            <div className="uk-inline">
              <button
                className="uk-button primary uk-margin-right"
                type="button"
                onClick={back}
              >
                Back
              </button>
              <IconButton onClick={clearFilter}>
                <FilterAltOffIcon />
              </IconButton>
              <IconButton data-uk-toggle="target: #offcanvas-flip">
                <FilterAltIcon />
              </IconButton>
            </div>
          </div>
        </div>
        <RecordGrid data={specificCustomerRecord} />
      </div>
      <div id="offcanvas-flip" data-uk-offcanvas="flip: true; overlay: true">
        <div className="uk-offcanvas-bar">
          <button
            className="uk-offcanvas-close"
            type="button"
            data-uk-close
          ></button>
          <h6>Filter Statements</h6>
          <form className="uk-grid-small" data-uk-grid>
            <div className="uk-width-1-1">
              <label htmlFor="">Property</label>
              <select
                className="uk-input"
                placeholder="100"
                aria-label="100"
                onChange={(e) => setSetPropertyId(e.target.value)}
              >
                <option value="" style={{ color: "grey" }}>
                  Select Supplier Account
                </option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id} style={{ color: "grey" }}>
                    {p.BodyCopName}
                  </option>
                ))}
              </select>
            </div>
            <div className="uk-width-1-1">
              <label htmlFor="">Supplier Account</label>
              <select
                className="uk-input"
                placeholder="100"
                aria-label="100"
                onChange={(e) => setSupplierId(e.target.value)}
              >
                <option value="" style={{ color: "grey" }}>
                  Select Supplier Account
                </option>
                {suppliers.map((p) => (
                  <option key={p.id} value={p.id} style={{ color: "grey" }}>
                    {p.name} , {p.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="uk-width-1-1">
              <h5>Date Range</h5>
            </div>

            <div className="uk-width-1-2">
              <label htmlFor="">From </label>
              <input
                className="uk-input"
                type="date"
                aria-label="50"
                value={dateFrom ? dateFrom.toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  handleDateFilterChange(
                    e.target.value ? new Date(e.target.value) : null,
                    dateTo
                  )
                }
              />
            </div>
            <div className="uk-width-1-2">
              <label htmlFor="">To </label>
              <input
                className="uk-input"
                type="date"
                aria-label="25"
                value={dateTo ? dateTo.toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  handleDateFilterChange(
                    dateFrom,
                    e.target.value ? new Date(e.target.value) : null
                  )
                }
              />
            </div>
            <IconButton onClick={combine}>
              <FilterAltIcon style={{ color: "white" }} />
            </IconButton>
          </form>
        </div>
      </div>
    </div>
  );
});

const RecordGrid = ({ data }: IProp) => {
  const columns: GridColDef[] = [
    { field: "date", headerName: "Date", width: 150 },
    { field: "reference", headerName: "Reference", width: 150 },
    { field: "transactionType", headerName: "TransactionType", width: 150 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "debit", headerName: "Debit", width: 150 },
    { field: "credit", headerName: "Credit", width: 150 },
    { field: "balance", headerName: "Balance", width: 150 },
  ];
  return (
    <Box className="companies-grid">
      <DataGrid
        rows={data}
        //   columns={column}
        columns={columns}
        getRowId={(row) => row.id}
        rowHeight={50}
      />
    </Box>
  );
};

// const customerReceipts = comData.filter(
//   (transaction) => transaction.transactionType === "Supplier Payment"
// );
// customerReceipts.forEach((receipt) => {
//   const matchingInvoice = comData.find(
//     (transaction) =>
//       transaction.transactionType === "Supplier Invoice" &&
//       transaction.invoiceNumber === receipt.invoiceNumber
//   );
//   if (matchingInvoice) {
//     receipt.balance =
//       parseFloat(matchingInvoice.credit) - parseFloat(receipt.debit);
//   }
// });
