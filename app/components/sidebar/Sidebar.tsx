import { FiHome, FiBell } from "react-icons/fi";
import {
  HiOutlineHashtag,
  HiOutlineDotsCircleHorizontal,
} from "react-icons/hi";
import { BsBookmark, BsCollection } from "react-icons/bs";
import { AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { useSession, signIn, signOut } from "next-auth/react";

import SidebarRow from "./sidebar-row/SidebarRow";

import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  const { data: session } = useSession();

  return (
    <div className={styles.sidebar}>
      <img className="h-10 w-10" src="https://links.papareact.com/drg" alt="" />
      <SidebarRow Icon={FiHome} title="Home" />
      <SidebarRow Icon={HiOutlineHashtag} title="Explore" />
      <SidebarRow Icon={FiBell} title="Notifications" />
      <SidebarRow Icon={AiOutlineMail} title="Messages" />
      <SidebarRow Icon={BsBookmark} title="Bookmarks" />
      <SidebarRow
        onClick={!session ? signIn : signOut}
        Icon={AiOutlineUser}
        title={session ? "Sign Out" : "Sign In"}
      />
      <SidebarRow Icon={BsCollection} title="Lists" />
      <SidebarRow Icon={HiOutlineDotsCircleHorizontal} title="More" />
    </div>
  );
};

export default Sidebar;
