import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../../../shared/functions/Context";
import { Box, IconButton } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface Statement {
  date: string;
  reference: string;
  transactionType: string;
  description: string;
  debit: string;
  credit: string;
  balance: number;
  id: string;
  propertyId: string;
  unitId: string;
  invoiceNumber: string;
}

interface IProp {
  data: Statement[];
}

export const CustomerReportNEDBANK = observer(() => {
  const { store, api } = useAppContext();
  const navigate = useNavigate();
  const [propertyId, setPropertyId] = useState<string>("");
  const [unitId, setUnitId] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  const back = () => {
    navigate("/c/accounting/statements");
  };

  useEffect(() => {
    const getData = async () => {
      await api.body.nedbank.getAll();
      await api.body.copiedInvoice.getAll();
      await api.body.body.getAll();
      await api.unit.getAll();
    };
    getData();
  }, [api.body.body, api.body.copiedInvoice, api.body.nedbank, api.unit]);

  const properties = store.bodyCorperate.bodyCop.all.map((p) => {
    return p.asJson;
  });

  const units = store.bodyCorperate.unit.all.map((u) => {
    return u.asJson;
  });

  const record = store.bodyCorperate.nedbank.all
    .filter(
      (r) =>
        r.asJson.propertyId !== "" &&
        r.asJson.unitId !== "" &&
        r.asJson.accountId === "" &&
        r.asJson.transferId === "" &&
        r.asJson.supplierId === "" &&
        r.asJson.allocated === true
    )
    .map((r) => {
      return r.asJson;
    });

  const recordInvoiceNumber = record.map((r) => {
    return r.invoiceNumber;
  });

  const invoices = store.bodyCorperate.copiedInvoices.all
    .filter((inv) => recordInvoiceNumber.includes(inv.asJson.invoiceNumber))
    .map((inv) => {
      return inv.asJson;
    });

  const [combinedData, setCombinedData] = useState<Statement[]>([]);

  const combine = () => {
    const dataMap: Record<string, Statement[]> = {};

    // Group record data by invoiceNumber
    record.forEach((recordItem) => {
      if (!dataMap[recordItem.invoiceNumber]) {
        dataMap[recordItem.invoiceNumber] = [];
      }

      dataMap[recordItem.invoiceNumber].push({
        date: recordItem.transactionDate,
        reference: recordItem.rcp,
        transactionType: "Customer Receipt",
        description: recordItem.description,
        credit: recordItem.credit.toFixed(2),
        debit: recordItem.debit.toFixed(2),
        balance: 0,
        propertyId: recordItem.propertyId,
        unitId: recordItem.unitId,
        invoiceNumber: recordItem.invoiceNumber,
        id: recordItem.id,
      });
    });

    // Group invoice data by invoiceNumber
    invoices.forEach((invoiceItem) => {
      if (!dataMap[invoiceItem.invoiceNumber]) {
        dataMap[invoiceItem.invoiceNumber] = [];
      }

      dataMap[invoiceItem.invoiceNumber].push({
        date: invoiceItem.dateIssued,
        reference: invoiceItem.invoiceNumber,
        transactionType: "Tax Invoice",
        description: invoiceItem.references,
        credit: "",
        debit: invoiceItem.totalDue.toFixed(2),
        balance: invoiceItem.totalDue,
        propertyId: invoiceItem.propertyId,
        unitId: invoiceItem.unitId,
        invoiceNumber: invoiceItem.invoiceNumber,
        id: invoiceItem.invoiceId,
      });
    });

    // Flatten grouped data into a single array
    const comData = Object.values(dataMap).flatMap((group) => group);

    // Calculate balances for customer receipts

    const customerReceipts = comData.filter(
      (transaction) => transaction.transactionType === "Customer Receipt"
    );
    
    // Create an object to store total credit for each invoice number
    const invoiceCreditMap: Record<string, number> = {};
    
    customerReceipts.forEach((receipt) => {
      const { invoiceNumber, credit } = receipt;
    
      // Add the credit to the existing total or initialize if not present
      invoiceCreditMap[invoiceNumber] = (invoiceCreditMap[invoiceNumber] || 0) + parseFloat(credit);
    });
    
    customerReceipts.forEach((receipt) => {
      const matchingInvoice = comData.find(
        (transaction) =>
          transaction.transactionType === "Tax Invoice" &&
          transaction.invoiceNumber === receipt.invoiceNumber
      );
      
      if (matchingInvoice) {
        // Deduct the total credit from the debit of the matching invoice
        receipt.balance = parseFloat(matchingInvoice.debit) - (invoiceCreditMap[receipt.invoiceNumber] || 0);
      }
    });
  //   const customerReceipts = comData.filter(
  //     (transaction) => transaction.transactionType === "Customer Receipt"
  //   );
  //   customerReceipts.forEach((receipt) => {
  //     const matchingInvoice = comData.find(
  //       (transaction) =>
  //         transaction.transactionType === "Tax Invoice" &&
  //         transaction.invoiceNumber === receipt.invoiceNumber
  //     );
  //     if (matchingInvoice) {
  //       receipt.balance =
  //         parseFloat(matchingInvoice.debit) - parseFloat(receipt.credit);
  //     }
  //   });

    // Update the state with the combined data
    setCombinedData(comData);
  };

  //filter from and to date
  const filteredData = combinedData.filter((statement) => {
    const statementDate = new Date(statement.date);

    if (dateFrom && dateTo) {
      if (statement.transactionType === "Customer Receipt") {
        // Find tax invoices with the same invoiceNumber and date within the range
        const relatedInvoices = combinedData.filter(
          (invoice) =>
            invoice.transactionType === "Tax Invoice" &&
            invoice.invoiceNumber === statement.invoiceNumber &&
            new Date(invoice.date) >= dateFrom &&
            new Date(invoice.date) <= dateTo
        );

        return relatedInvoices.length > 0;
      } else {
        return statementDate >= dateFrom && statementDate <= dateTo;
      }
    } else if (dateFrom && !dateTo) {
      if (statement.transactionType === "Customer Receipt") {
        // Find tax invoices with the same invoiceNumber and date greater than dateFrom
        const relatedInvoices = combinedData.filter(
          (invoice) =>
            invoice.transactionType === "Tax Invoice" &&
            invoice.invoiceNumber === statement.invoiceNumber &&
            new Date(invoice.date) >= dateFrom
        );

        return relatedInvoices.length > 0;
      } else {
        return statementDate >= dateFrom;
      }
    } else if (!dateFrom && dateTo) {
      if (statement.transactionType === "Customer Receipt") {
        // Find tax invoices with the same invoiceNumber and date less than dateTo
        const relatedInvoices = combinedData.filter(
          (invoice) =>
            invoice.transactionType === "Tax Invoice" &&
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

  //displaying related tax invoices and customer receipt have tax invoice first and customer receipt second
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
      if (a.transactionType === "Tax Invoice") {
        return -1; // Tax Invoices come before Customer Receipts
      } else if (b.transactionType === "Tax Invoice") {
        return 1;
      }
      return 0;
    });

    groupedData.push(...sortedStatements);
    currentIndex += statementsWithSameInvoice.length;
  }

  const specificCustomerRecord = groupedData.filter(
    (f) => f.propertyId === propertyId && f.unitId === unitId
  );

  const clearFilter = () => {
    setPropertyId("");
    setUnitId("");
    setDateFrom(null);
    setDateTo(null);
  };

  return (
    <div className="uk-section leave-analytics-page">
    <div className="uk-container uk-container-large">
      <div className="section-toolbar uk-margin">
        <h4 className="section-heading uk-heading">
          NEDBANK / Customer Transaction Report
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
              onChange={(e) => setPropertyId(e.target.value)}
            >
              <option value="" style={{ color: "grey" }}>
                Select Property
              </option>
              {properties.map((p) => (
                <option key={p.id} value={p.id} style={{ color: "grey" }}>
                  {p.BodyCopName}
                </option>
              ))}
            </select>
          </div>
          <div className="uk-width-1-1">
            <label htmlFor="">Customer</label>
            <select
              disabled={propertyId === ""}
              className="uk-input"
              placeholder="100"
              aria-label="100"
              onChange={(e) => setUnitId(e.target.value)}
            >
              <option value="" style={{ color: "grey" }}>
                Select Unit
              </option>
              {units
                .filter((u) => u.bodyCopId === propertyId)
                .map((u) => (
                  <option value={u.id} key={u.id} style={{ color: "grey" }}>
                    Unit {u.unitName}
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
  )
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
  