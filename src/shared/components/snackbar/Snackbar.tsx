import { observer } from "mobx-react-lite";
import { useEffect } from "react";

const fadein = (posFromBottom: number) => {
  return `
  @keyframes fadein {
    from {
      bottom: 0;
      opacity: 0;
    }
    to {
      bottom: ${posFromBottom}px;
      opacity: 1;
    }
  }
`;
};

interface Props {
  index: number;
  id: number;
  type: "primary" | "success" | "warning" | "danger" | "default";
  message: string;
  children?: any;
  timeoutInMs?: number;
  onClose: (index: number) => void;
}
const Snackbar = observer((props: Props) => {
  const {
    index,
    id,
    type,
    message,
    children,
    timeoutInMs = 3500,
    onClose,
  } = props;

  const posFromBottom = (index + 1) * 45;

  useEffect(() => {
    setTimeout(() => {
      onClose(id);
    }, timeoutInMs);

    return () => {};
  }, [id, onClose, timeoutInMs]);

  return (
    <div className={`snackbar ${type}`} style={{ bottom: posFromBottom }}>
      <style children={fadein(posFromBottom)} />
      <div className="content">
        <span className="message">{message}</span>
        {children}
      </div>

      <button className="close-btn" onClick={() => onClose(id)}>
        <span data-uk-icon="close"></span>
      </button>
    </div>
  );
});

export default Snackbar;
