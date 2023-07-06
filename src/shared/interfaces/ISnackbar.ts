export default interface ISnackbar {
  id: number;
  message: string;
  type: "primary" | "success" | "warning" | "danger" | "default";
  children?: any;
  timeoutInMs?: number;
}
