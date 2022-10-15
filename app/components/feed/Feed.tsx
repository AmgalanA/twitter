import { useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import { toast } from "react-hot-toast";

import { Tweet } from "../../../typings";
import { fetchTweets } from "../../../utils/fetchTweets";
import styles from "./Feed.module.scss";
import TweetBox from "./tweet-box/TweetBox";
import TweetComponent from "./tweet/Tweet";

interface Props {
  tweets: Tweet[];
}

const Feed = ({ tweets: tweetsProp }: Props) => {
  const [tweets, setTweets] = useState<Tweet[]>(tweetsProp);

  const handleRefresh = async () => {
    const refreshToast = toast.loading("Refreshing...");

    const tweets = await fetchTweets();

    setTweets(tweets);

    toast.success("Feed Updated", {
      id: refreshToast,
    });
  };

  return (
    <div className={styles.feed}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Home</h1>

        <FiRefreshCcw onClick={handleRefresh} className={styles.refreshIcon} />
      </div>

      <div>
        <TweetBox setTweets={setTweets} />
      </div>

      <div>
        {tweets.map((tweet) => (
          <TweetComponent tweet={tweet} key={tweet._id} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
