import { observer } from "mobx-react-lite";
import { useAppContext } from "../../functions/Context";
import Snackbar from "./Snackbar";

const SnackbarManager = observer(() => {
  const { ui } = useAppContext();

  const onClose = (id: number) => {
    ui.snackbar.remove(id);
  };

  return (
    <div>
      {ui.snackbar.snackbars &&
        ui.snackbar.snackbars.map((snackbar, index) => (
          <Snackbar
            index={index}
            id={snackbar.id}
            type={snackbar.type}
            message={snackbar.message}
            children={snackbar.children}
            timeoutInMs={snackbar.timeoutInMs}
            onClose={onClose}
          />
        ))}
    </div>
  );
});

export default SnackbarManager;
