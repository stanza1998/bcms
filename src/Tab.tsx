interface IProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const Tab: React.FC<IProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`uk-button uk-margin-right primary${
        isActive ? " active" : ""
      }`}
      onClick={onClick}
      style={{
        background: isActive ? "#000c37" : "",
      }}
    >
      {label}
    </button>
  );
};
