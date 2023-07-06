import ReactDOM from "react-dom";

interface IProps {
  classes?: string;
  children: any;
  attachTo: Element;
}
const Portal = (props: IProps) => {
  const { children, classes, attachTo } = props;
  const cssClass = classes ? classes : "";

  const portal = <div className={`portal ${cssClass}`}>{children}</div>;

  return ReactDOM.createPortal(portal, attachTo);
};

export default Portal;
