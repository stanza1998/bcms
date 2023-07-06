import { ORDERS_STAGES, ORDERS_STATUSES } from "../constants/Orderstatuses";
import { OrderIdGenerator } from "../functions/IDGenerator";

export const defaultOrder: IOrder = {
	id: OrderIdGenerator(),
	type: "Order",
	orderSummary: {
		createdOn: Date.now(),
		closedOn: null,
		isActive: true,
		isSuccessful: false,
		estimatedAmount: 0,
		customerName: "",
		customerId: "",
		activeStage: ORDERS_STAGES.REQUEST,
		status: ORDERS_STATUSES.REQUEST.PENDING_ACCEPTANCE,
	},
	request: {
		requestType: "fuel",
		status: ORDERS_STATUSES.REQUEST.PENDING_ACCEPTANCE,
		createdOn: Date.now(),
		completedOn: null,
		comments: "Customer credit is enough.",
		items: [],
	},
	quotation: {
		isSent: false,
	},
	purchaseOrder: {
		isSent: false,
	},
	salesOrder: {
		isSent: false,
	},
	goodsReceivedNote: {
		isSent: false,
	},
	invoice: {
		isSent: false,
	},
	proofOfPayment: {
		isSent: false,
	},
	closedOrder: {},
};

export interface IOrderSummary {
	createdOn: number;
	closedOn: number | null;
	isActive: boolean;
	isSuccessful: boolean;
	estimatedAmount: number;
	customerName: string;
	customerId: string;
	activeStage: string;
	status: {
		value: string;
		type: "red" | "green" | "blue" | "warning" | "archived" | string;
	};
	timeStatus?: {
		value: string;
		type: "red" | "green" | "blue" | "warning" | "archived" | string;
	};
}

export interface IOrderFuelRequestItem {
	productId: string;
	name: string;
	description: string;
	quantity: number;
}

export interface IOrderLubeRequestItem {
	productId: string;
	stockCode: string;
	description: string;
	quantity: number;
}

interface OrderStageCommonProperties {
	status?: {
		value: string;
		type: "red" | "green" | "blue" | "warning" | "archived" | string;
	};
	timeStatus?: {
		value: string;
		type: "red" | "green" | "blue" | "warning" | "archived" | string;
	};
	createdOn?: number;
	completedOn?: number | null;
	comments?: string;
}

export interface IOrderRequest extends OrderStageCommonProperties {
	requestType: "fuel" | "lube";
	items: IOrderLubeRequestItem[] | IOrderFuelRequestItem[];
}

export interface IAttachment {
	fileName: string;
	fileURL: string;
}

export interface IOrderQuotation extends OrderStageCommonProperties {
	isSent: boolean;
	attachments?: IAttachment[];
}

export interface IOrderPurchaseOrder extends OrderStageCommonProperties {
	isSent: boolean;
	attachments?: IAttachment[];
}

export interface IOrderSalesOrder extends OrderStageCommonProperties {
	isSent: boolean;
	attachments?: IAttachment[];
}

export interface IOrderGoodsReceivedNote extends OrderStageCommonProperties {
	isSent: boolean;
	attachments?: IAttachment[];
}

export interface IOrderInvoice extends OrderStageCommonProperties {
	isSent: boolean;
	attachments?: IAttachment[];
}

export interface IOrderProofOfPayment extends OrderStageCommonProperties {
	isSent: boolean;
	attachments?: IAttachment[];
}

export interface IOrderClosedOrder extends OrderStageCommonProperties {
	attachments?: IAttachment[];
}

export default interface IOrder {
	id: string;
	type: "Order";
	orderSummary: IOrderSummary;
	request: IOrderRequest;
	quotation: IOrderQuotation;
	purchaseOrder: IOrderPurchaseOrder;
	salesOrder: IOrderSalesOrder;
	goodsReceivedNote: IOrderGoodsReceivedNote;
	invoice: IOrderInvoice;
	proofOfPayment: IOrderProofOfPayment;
	closedOrder: IOrderClosedOrder;
}
