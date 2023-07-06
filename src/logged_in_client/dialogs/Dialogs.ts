const DIALOG_NAMES = {
	// Orders
	ORDERS: {
		CLOSE_ORDER_DIALOG: "close-order-dialog",
		NEW_ORDER_DIALOG: "new-order-dialog",
		REQUEST: {},
		QUOTATION: {
			ACCEPT_QUOTE_DIALOG: "accept-quote-dialog",
			DENY_QUOTE_DIALOG: "deny-quote-dialog",
		},
		PURCHASE_ORDER: {
			SEND_PO_DIALOG: "send-po-dialog",
		},
		SALES_ORDER: {
			CLIENT_TRACKING_DIALOG: "client-so-tracking-dialog",
		},
		GOODS_RECEIVED_NOTE: {
			SEND_GRN_DIALOG: "send-grn-dialog",
			REQUEST_FOR_GRN_DIALOG: "request-for-grn-dialog",
		},
		INVOICE: {
			REQUEST_FOR_INVOICE_DIALOG: "request-for-invoice-dialog",
		},
		PROOF_OF_PAYMENT: {
			SEND_POP_DIALOG: "send-pop-dialog",
		},
	},
};

export default DIALOG_NAMES;
