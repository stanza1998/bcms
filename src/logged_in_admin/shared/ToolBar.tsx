interface Props {
  heading: string;
  controls: JSX.Element;
}
const ToolBar = (props: Props) => {
  const { heading, controls } = props;

  return (
    <div className="section-toolbar uk-margin">
      <h4 className="section-heading uk-heading">{heading}</h4>
      <div className="controls">{controls}</div>
    </div>
  );
};

export default ToolBar;
