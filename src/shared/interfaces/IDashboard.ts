// -------------------------------------------------------------------//
// ORDERS DEFUALT
export const defaultOrdersDashboardData: IOrderDashboardData = {
  all: 0,
  active: 0,
  successful: 0,
  unsuccessful: 0,
};
// ORDERS OVERVIEW
export interface IOrderDashboardData {
  active: number;
  successful: number;
  unsuccessful: number;
  all: number;
}

// -------------------------------------------------------------------//
// INVENTORY DEFUALT
export const defaultFuelDashboardData: IFuelDashboardData = {
  available: 0,
  outOfStock: 0,
};
export const defaultLubeDashboardData: ILubeDashboardData = {
  available: 0,
  outOfStock: 0,
};
export const defaultPricingDashboardData: IPricingDashboardData = {
  reviewed: 0,
  awaitingReviewal: 0,
};
// INVENTORY OVERVIEW
export interface IFuelDashboardData {
  available: number;
  outOfStock: number;
}
export interface ILubeDashboardData {
  available: number;
  outOfStock: number;
}
export interface IPricingDashboardData {
  reviewed: number;
  awaitingReviewal: number;
}
