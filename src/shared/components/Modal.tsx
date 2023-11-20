import React from "react";
import ReactDOM from "react-dom";
import "./Modal.scss";

interface IProps {
  modalId: string;
  classes?: string;
  children: any;
}
const Modal = (props: IProps) => {
  const { modalId, classes, children } = props;
  const cssClass = classes ? classes : "";

  const modal = (
    <div
      id={modalId}
      className={`custom-modal-style ${cssClass}`}
      data-uk-modal
      data-bg-close={false}
    >
      {children}
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
};

export default Modal;

export const OffCanvasModal = (props: IProps) => {
  const { modalId, classes, children } = props;
  const cssClass = classes ? classes : "";

  const offCanvas = (
    <div
      id={modalId}
      className={`custom-modal-style  ${cssClass}`}
      data-uk-offcanvas="flip: true; overlay: true"
    >
      {children}
    </div>
  );

  return ReactDOM.createPortal(offCanvas, document.body);
};
