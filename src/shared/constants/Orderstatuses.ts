export const ORDERS_STATUSES = {
  REQUEST: {
    PENDING_ACCEPTANCE: {
      value: "Pending acceptance",
      type: "warning",
    },
    DENIED: {
      value: "Denied",
      type: "red",
    },
    ACCEPTED: {
      value: "Accepted",
      type: "green",
    },
  },
  QUOTATION: {
    AWAITING_QUOTE: {
      value: "Awaiting quote",
      type: "warning",
    },
    NOT_SEND: {
      value: "Quote not send",
      type: "warning",
    },
    PENDING_APPROVAL: {
      value: "Pending approval",
      type: "warning",
    },
    APPROVED: {
      value: "Approved",
      type: "green",
    },
    DENIED: {
      value: "Denied",
      type: "red",
    },
  },
  PURCHASE_ORDER: {
    AWAITING_PO: {
      value: "Awaiting PO",
      type: "warning",
    },
    NOT_SEND: {
      value: "PO not send",
      type: "warning",
    },
    PENDING_APPROVAL: {
      value: "Pending approval",
      type: "warning",
    },
    APPROVED: {
      value: "Approved",
      type: "green",
    },
    DENIED: {
      value: "Denied",
      type: "red",
    },
  },
  SALES_ORDER: {
    PENDING_SO: {
      value: "Pending SO",
      type: "warning",
    },
    COMPLETED: {
      value: "Completed",
      type: "green",
    },
  },
  GOODS_RECEIVED_NOTE: {
    AWAITING_GRN: {
      value: "Awaiting GRN",
      type: "warning",
    },
    NOT_SEND: {
      value: "GRN not send",
      type: "warning",
    },
    PENDING_SIGNATURE: {
      value: "Pending signature",
      type: "warning",
    },
    SIGNED: {
      value: "GRN signed",
      type: "green",
    },
  },
  INVOICE: {
    AWAITING_INVOICE: {
      value: "Awaiting invoice",
      type: "warning",
    },
    NOT_SEND: {
      value: "Invoice not send",
      type: "warning",
    },
    PENDING_PAYMENT: {
      value: "Pending payment",
      type: "warning",
    },
    PAID: {
      value: "Paid",
      type: "green",
    },
  },
  PROOF_OF_PAYMENT: {
    AWAITING_POP: {
      value: "Awaiting POP",
      type: "warning",
    },
    NOT_SEND: {
      value: "POP not send",
      type: "warning",
    },
    PENDING_VERIFICATION: {
      value: "Pending verification",
      type: "warning",
    },
    VERIFIED: {
      value: "Verified",
      type: "green",
    },
    DENIED: {
      value: "Denied",
      type: "red",
    },
  },
  CLOSED: {
    SUCCESSFUL: {
      value: "Successful order",
      type: "green",
    },
    UNSUCCESSFUL: {
      value: "Unsuccessful order",
      type: "red",
    },
  },
};

export const ORDERS_STAGES = {
  REQUEST: "Request",
  QUOTATION: "Quotation",
  PURCHASE_ORDER: "Purchase Order",
  SALES_ORDER: "Sales order",
  GOODS_RECEIVED_NOTE: "Goods received note",
  INVOICE: "Invoice",
  PROOF_OF_PAYMENT: "Proof of payment",
  CLOSED: "Closed",
};
