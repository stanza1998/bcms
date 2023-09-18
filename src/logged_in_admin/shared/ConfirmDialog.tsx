import React, { useRef } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

interface IProps {
  onAccept: () => void;
  onReject: () => void;
  onConfirm: () => void;
}

const Dialog: React.FC<IProps> = ({ onAccept, onReject, onConfirm }) => {
  const toast = useRef<Toast>(null);

  const accept = () => {
    onAccept();
    toast.current?.show({
      severity: "info",
      summary: "Confirmed",
      detail: "You have accepted",
      life: 3000,
    });
  };

  const reject = () => {
    onReject();
    toast.current?.show({
      severity: "warn",
      summary: "Rejected",
      detail: "You have rejected",
      life: 3000,
    });
  };

  const showConfirmationDialog = (position: any) => {
    onConfirm();
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      position,
      accept,
      reject,
    });
  };

  return (
    <>
      <Toast ref={toast} />
      {/* You can trigger the confirmation dialog wherever you need it */}
      {/* <button onClick={() => showConfirmationDialog("top")}>Delete Record</button> */}
    </>
  );
};

export default Dialog;
