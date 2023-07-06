interface Props {
  title: string;
  controls?: JSX.Element;
}
const ToolBar = (props: Props) => {
  const { title, controls } = props;

  return (
    <div className="section-toolbar uk-margin">
      <h4 className="section-heading uk-heading">{title}</h4>
      {controls && <div className="controls">{controls}</div>}
    </div>
  );
};

export default ToolBar;
