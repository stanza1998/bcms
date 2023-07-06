import { useState } from "react";

interface IHeadProp {
  title: string;
  children?: JSX.Element;
}
export const CustomCloseAccordion = ({ title, children }: IHeadProp) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const onClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="custom-made-accordion">
      <div className="position-relative">
        <h4 className="custom-title" onClick={onClick}>
          {title}
        </h4>
        <div className="more">
          <span
            onClick={onClick}
            className={`icon ${isExpanded ? "expanded" : ""}`}
            data-uk-icon="chevron-down"
          ></span>
        </div>
      </div>
      <div
        className={`custom-accordion ${isExpanded ? "expanded" : ""}`}
      >
        {children}
      </div>
    </div>
  );
};

export const CustomOpenAccordion = ({ title, children }: IHeadProp) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const onClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="custom-made-accordion">
      <div className="position-relative">
        <h4 className="custom-title" onClick={onClick}>
          {title}
        </h4>
        <div className="more">
          <span
            onClick={onClick}
            className={`icon ${isExpanded ? "expanded" : ""}`}
            data-uk-icon="chevron-down"
          ></span>
        </div>
      </div>
      <div
        className={`custom-accordion ${isExpanded ? "expanded" : ""}`}
      >
        {children}
      </div>
    </div>
  );
};
