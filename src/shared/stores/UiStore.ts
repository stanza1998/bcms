import SnackbarStore from "./individualStore/SnackbarStore";

export default class UiStore {
  snackbar = new SnackbarStore(this);
}
