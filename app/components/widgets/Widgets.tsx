import { AiOutlineSearch } from "react-icons/ai";
import { TwitterTimelineEmbed } from "react-twitter-embed";

import styles from "./Widgets.module.scss";

const Widgets = () => {
  return (
    <div className={styles.widgets}>
      {/* Search box */}

      <div className={styles.search}>
        <AiOutlineSearch className={styles.searchIcon} />

        <input type="text" placeholder="Search..." />
      </div>

      <TwitterTimelineEmbed
        sourceType="profile"
        screenName="saurabhnemade"
        options={{ height: 400 }}
      />
    </div>
  );
};

export default Widgets;
