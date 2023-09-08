import "./Tool.scss";
import ErrorBoundary from "./error-boundary/ErrorBoundary";

interface Props {
  title?: string;
  leftControls?: JSX.Element;
  rightControls: JSX.Element;
}

const Toolbar2 = (props: Props) => {
  const { title, leftControls, rightControls } = props;

  return (
    <ErrorBoundary>
      <div className="toolbar uk-margin">
        {title && <h4 className="title uk-heading">{title}</h4>}
        {!title && <div className="controls">{leftControls}</div>}
        <div className="controls mg-top">{rightControls}</div>
      </div>
    </ErrorBoundary>
  );
};

export default Toolbar2;
