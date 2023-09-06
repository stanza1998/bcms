import { Box, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ICopiedInvoice } from "../../../../../shared/models/invoices/CopyInvoices";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import PaidIcon from "@mui/icons-material/Paid";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../../../shared/functions/Context";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import {
  IBodyCop,
  defaultBodyCop,
} from "../../../../../shared/models/bcms/BodyCorperate";
import { IUnit, defaultUnit } from "../../../../../shared/models/bcms/Units";
import { defaultInvoice } from "../../../../../shared/models/invoices/Invoices";
import {
  IFinancialMonth,
  defaultFinancialMonth,
} from "../../../../../shared/models/monthModels/FinancialMonth";
import {
  IFinancialYear,
  defaultFinancialYear,
} from "../../../../../shared/models/yearModels/FinancialYear";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import Modal from "../../../../../shared/components/Modal";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PreviewIcon from "@mui/icons-material/Preview";

interface IProp {
  data: ICopiedInvoice[];
}

const InvoicesGrid = observer(({ data }: IProp) => {
  const { store, api } = useAppContext();
  const navigate = useNavigate();
  const me = store.user.meJson;

  useEffect(() => {
    const getData = async () => {
      await api.body.body.getAll();
      if (me?.property && me.year)
        await api.body.copiedInvoice.getAll(me.property, me.year);
      if (me?.property) await api.body.financialYear.getAll(me?.property);
      if ((me?.property, me?.year))
        await api.body.financialMonth.getAll(me.property, me.year);
      await api.auth.loadAll();
    };
    getData();
  }, [
    api.auth,
    api.body.body,
    api.body.copiedInvoice,
    api.body.financialMonth,
    api.body.financialYear,
    api.unit,
    me?.property,
    me?.year,
  ]);

  const [invoiceView, setInvoiceView] = useState<ICopiedInvoice | undefined>({
    ...defaultInvoice,
  });

  const [viewBody, setBody] = useState<IBodyCop | undefined>({
    ...defaultBodyCop,
  });

  const [unit, setUnit] = useState<IUnit | undefined>({
    ...defaultUnit,
  });

  const [year, setYear] = useState<IFinancialYear | undefined>({
    ...defaultFinancialYear,
  });

  const [month, setMonth] = useState<IFinancialMonth | undefined>({
    ...defaultFinancialMonth,
  });

  const viewInvoiceDetails = async (
    invoiceId: string,
    pid: string,
    uid: string,
    mid: string,
    yid: string
  ) => {
    const invoiceDetails =
      store.bodyCorperate.copiedInvoices.getById(invoiceId);
    setInvoiceView(invoiceDetails?.asJson);
    showModalFromId(DIALOG_NAMES.BODY.VIEW_INVOICE);
    await api.body.body.getAll();
    const property = store.bodyCorperate.bodyCop.getById(pid);
    setBody(property?.asJson);
    const unit = store.bodyCorperate.unit.getById(uid);
    setUnit(unit?.asJson);
    const month = store.bodyCorperate.financialMonth.getById(mid);
    setMonth(month?.asJson);
    const year = store.bodyCorperate.financialYear.getById(yid);
    setYear(year?.asJson);
    if (me?.property) await api.unit.getAll(me?.property);
  };

  //unit data
  const verifyInvoice = (
    invoiceId: string,
    propertyId: string,
    id: string,
    yearId: string
  ) => {
    navigate(
      `/c/accounting/invoices/copiedAcc/${propertyId}/${id}/${yearId}/${invoiceId}/`
    );
  };

  const columns: GridColDef[] = [
    { field: "invoiceNumber", headerName: "Invoice Number", width: 200 },
    { field: "dateIssued", headerName: "Date Issued", width: 200 },
    {
      field: "totalPaid",
      headerName: "Total Paid",
      width: 200,
      valueFormatter: (params) => `NAD ${params.value}`,
    },
    {
      field: "totalDue",
      headerName: "Total Amount",
      width: 200,
      valueFormatter: (params) => `NAD ${params.value}`,
    },
    {
      field: "Status",
      headerName: "Status",
      renderCell: (params) => (
        <div>
          {params.row.totalPaid >= params.row.totalDue && (
            <PaidIcon style={{ color: "#01aced" }} />
          )}
          {params.row.totalPaid < params.row.totalDue && (
            <PaidIcon style={{ color: "red" }} />
          )}
        </div>
      ),
    },
    {
      field: "Action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton
            onClick={() =>
              viewInvoiceDetails(
                params.row.invoiceId,
                params.row.propertyId,
                params.row.unitId,
                params.row.monthId,
                params.row.yearId
              )
            }
          >
            <MoreHorizIcon />
          </IconButton>

          <IconButton
            onClick={() =>
              verifyInvoice(
                params.row.invoiceId,
                params.row.propertyId,
                params.row.unitId,
                params.row.yearId
              )
            }
          >
            <PreviewIcon />
          </IconButton>
        </div>
      ),
      //  valueGetter: () => toEdit, // Pass the toEdit function here
    },
  ];

  return (
    <>
      <Box sx={{ height: 450 }} className="invoices-grid">
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.invoiceId} // Use the appropriate identifier property
          rowHeight={50}
        />
      </Box>
      <Modal modalId={DIALOG_NAMES.BODY.VIEW_INVOICE}>
        <div
          className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
          style={{ width: "70%" }}
        >
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>

          <h3 className="uk-modal-title">Invoice Details</h3>
          <div
            className="uk-child-width-1-2@m uk-grid-small uk-grid-match"
            data-uk-grid
          >
            <div>
              <div className="uk-card-body">
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                  }}
                >
                  Property Name: {viewBody?.BodyCopName}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                  }}
                >
                  location: {viewBody?.location}
                </p>

                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                  }}
                >
                  Unit: {unit?.unitName}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                  }}
                >
                  Owner:{" "}
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
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    textAlign: "end",
                    textTransform: "uppercase",
                  }}
                >
                  Invoice Number: {invoiceView?.invoiceNumber}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    textAlign: "end",
                    textTransform: "uppercase",
                  }}
                >
                  Date: {invoiceView?.dateIssued.toLocaleString()}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    textAlign: "end",
                    textTransform: "uppercase",
                  }}
                >
                  Due Date: {invoiceView?.dueDate}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    textAlign: "end",
                    textTransform: "uppercase",
                  }}
                >
                  Total Due: N$ {invoiceView?.totalDue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <table className="uk-table uk-table-small uk-table-divider">
            <thead>
              <tr>
                <th>DESCRIPTION</th>
                <th className="uk-text-center">PRICE</th>
                <th className="uk-text-right">TOTAL PRICE</th>
              </tr>
            </thead>
            <tbody>
              {invoiceView?.serviceId.map((det, index) => (
                <tr key={index}>
                  <td
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                    }}
                  >
                    {det.description}
                  </td>
                  <td
                    className="uk-text-center"
                    style={{ fontSize: "13px", fontWeight: "600" }}
                  >
                    N$ {det.price.toFixed(2)}
                  </td>
                  <td
                    className="uk-text-right"
                    style={{ fontSize: "13px", fontWeight: "600" }}
                  >
                    N$ {det.price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
});

export default InvoicesGrid;
