declare const UIkit: any;

export const hideModalFromId = (id: string) => {
  const element = document.querySelector(`#${id}`);
  UIkit.modal(element).hide();
};

export default function showModalFromId(id: string) {
  const element = document.querySelector(`#${id}`);
  UIkit.modal(element).show();
}

export const hideOffcanvasFromId = (id: string) => {
  const element = document.querySelector(`#${id}`);
  UIkit.offcanvas(element).hide();
};

export function showOffcanvasFromId(id: string) {
  const element = document.querySelector(`#${id}`);
  UIkit.offcanvas(element).show();
}

export const confirmationDialog = () => {
  return UIkit.modal.confirm("Confirm Delete")
}
