import "./Alert.scss";

interface AlertProps {
  msg: string;
  children?: any;
  onClose: () => void;
  type: "danger" | "warning" | "success" | "primary";
}

const Alert = (props: AlertProps) => {
  const { msg, type, children, onClose } = props;

  switch (type) {
    case "danger":
      return (
        <div className={`uk-alert-${type}`} data-uk-alert>
          <div className="close" onClick={onClose}>
            <span uk-icon="icon: close"></span>
          </div>
          <p>
            <strong>Error!</strong> {msg}
          </p>
          {children && <>{children}</>}
        </div>
      );

    case "warning":
      return (
        <div className={`uk-alert-${type}`} data-uk-alert>
          <div className="close" onClick={onClose}>
            <span uk-icon="icon: close"></span>
          </div>
          <p>
            <strong>Warning!</strong> {msg}
          </p>
          {children && <>{children}</>}
        </div>
      );

    case "success":
      return (
        <div className={`uk-alert-${type}`} data-uk-alert>
          <div className="close" onClick={onClose}>
            <span uk-icon="icon: close"></span>
          </div>
          <p>
            <strong>Success!</strong> {msg}
          </p>
          {children && <>{children}</>}
        </div>
      );

    default:
      return (
        <div className={`uk-alert-primary`} data-uk-alert>
          <div className="close" onClick={onClose}>
            <span uk-icon="icon: close"></span>
          </div>
          <p>
            <strong>Note!</strong> {msg}
          </p>
          {children && <>{children}</>}
        </div>
      );
  }
};

interface Props {
  msg: string;
  children?: any;
  onClose: () => void;
}
export const ErrorAlert = (props: Props) => {
  return (
    <div className="alert uk-margin">
      <Alert {...props} type="danger" />
    </div>
  );
};

export const WarningAlert = (props: Props) => {
  return (
    <div className="alert uk-margin">
      <Alert {...props} type="warning" />
    </div>
  );
};

export const SuccessAlert = (props: Props) => {
  return (
    <div className="alert uk-margin">
      <Alert {...props} type="success" />
    </div>
  );
};

export const PrimaryAlert = (props: Props) => {
  return (
    <div className="alert uk-margin">
      <Alert {...props} type="primary" />
    </div>
  );
};
