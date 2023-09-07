import { Button } from "@mui/material";

interface IProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const Tab: React.FC<IProps> = ({ label, isActive, onClick }) => {
  return (
    <Button
      className={`uk-margin-right ${isActive ? " active" : ""}`}
      onClick={onClick}
      style={{
        background: isActive ? "#01aced" : "",
        color: isActive ? "white" : "grey",
      }}
    >
      {label}
    </Button>
  );
};
