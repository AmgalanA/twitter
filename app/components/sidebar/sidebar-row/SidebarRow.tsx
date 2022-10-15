import { IconType } from "react-icons";

import styles from "./SidebarRow.module.scss";

interface Props {
  Icon: IconType;
  title: string;
  onClick?: () => {};
}

const SidebarRow = ({ Icon, title, onClick }: Props) => {
  return (
    <div onClick={onClick} className={`group ${styles.sidebarRow}`}>
      <Icon className={`${styles.icon}`} />
      <p className="group-hover:text-twitter ">{title}</p>
    </div>
  );
};

export default SidebarRow;
