import {
  Dispatch,
  MouseEvent,
  MouseEventHandler,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import {
  HiOutlineEmojiHappy,
  HiOutlineLocationMarker,
  HiOutlinePhotograph,
  HiOutlineSearchCircle,
} from "react-icons/hi";
import { useSession } from "next-auth/react";

import styles from "./TweetBox.module.scss";
import { Tweet, TweetBody } from "../../../../typings";
import { fetchTweets } from "../../../../utils/fetchTweets";
import toast from "react-hot-toast";

type Props = {
  setTweets: Dispatch<SetStateAction<Tweet[]>>;
};

const TweetBox = ({ setTweets }: Props) => {
  const [input, setInput] = useState<string>("");
  const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");

  const imageInputRef = useRef<HTMLInputElement>(null);

  const { data: session } = useSession();

  const addImageToTweet = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    if (!imageInputRef.current?.value) return;

    setImage(imageInputRef.current.value);
    imageInputRef.current.value = "";
    setImageUrlBoxIsOpen(false);
  };

  const postTweet = async () => {
    const tweetBody: TweetBody = {
      text: input,
      username: session?.user?.name || "Unknown User",
      profileImg: session?.user?.image || "https://links.papareact.com/gll",
      image,
    };

    const result = await fetch(`/api/addTweet`, {
      body: JSON.stringify(tweetBody),
      method: "POST",
    });

    const json = await result.json();

    const newTweets = await fetchTweets();

    setTweets(newTweets);

    toast("Tweet Posted", {
      icon: "🚀",
    });

    return json;
  };

  const handleSubmit = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    postTweet();

    setInput("");
    setImage("");
    setImageUrlBoxIsOpen(false);
  };

  return (
    <div className={styles.tweetBoxWrapper}>
      <img
        src={session?.user?.image || "https://links.papareact.com/gll"}
        alt=""
      />

      <div className={styles.tweetBox}>
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="What's Happening?"
          />

          <div className={styles.infoWrapper}>
            <div className={styles.iconsWrapper}>
              <HiOutlineSearchCircle className={styles.icon} />
              <HiOutlinePhotograph
                onClick={() => setImageUrlBoxIsOpen((prev) => !prev)}
                className={styles.icon}
              />
              <HiOutlineEmojiHappy className={styles.icon} />
              <AiOutlineCalendar className={styles.icon} />
              <HiOutlineLocationMarker className={styles.icon} />
            </div>

            <button onClick={handleSubmit} disabled={!input || !session}>
              Tweet
            </button>
          </div>

          {imageUrlBoxIsOpen && (
            <form className={styles.imageForm}>
              <input
                ref={imageInputRef}
                type="text"
                placeholder="Enter Image URL..."
              />
              <button type="submit" onClick={addImageToTweet}>
                Add Image
              </button>
            </form>
          )}

          {image && <img src={image} alt="" className={styles.selectedImage} />}
        </form>
      </div>
    </div>
  );
};

export default TweetBox;
