import { ReactComponentElement, ReactElement, useState } from "react";
import "./Drawer.css";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactElement;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children }) => {
  const [drawerOpen, setDrawerOpen] = useState(isOpen);

  const closeDrawer = () => {
    setDrawerOpen(false);
    onClose();
  };

  return (
    <div className={`drawer ${drawerOpen ? "open" : ""}`}>
      <div className="overlay" onClick={closeDrawer}></div>
      <div className="content">{children}</div>
    </div>
  );
};

export default Drawer;
