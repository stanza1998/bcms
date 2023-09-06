export const defaultUser: IUser = {
  uid: "",
  firstName: "",
  lastName: "",
  email: "",
  cellphone: 0,
  password: "",
  departmentId: "",
  departmentName: "",
  role: "Employee",
  regionId: "",
  region: "",
  devUser: false,
  supervisor: "",
  property: "",
  year: "",
  month: "",
};

export interface IUser {
  devUser: boolean;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  cellphone: number;
  password?: string;
  departmentId: string;
  departmentName: string;
  role: string;
  regionId: string;
  region: string;
  supervisor: string;
  property: string;
  year: string;
  month: string;
}
