import TimeAgo from "react-timeago";
import { HiOutlineChatAlt2, HiOutlineSwitchHorizontal } from "react-icons/hi";
import { AiOutlineHeart, AiOutlineUpload } from "react-icons/ai";
import { useSession } from "next-auth/react";

import { Comment, CommentBody, Tweet } from "../../../../typings";

import styles from "./Tweet.module.scss";
import { fetchComments } from "../../../../utils/fetchComments";
import React, { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  tweet: Tweet;
}

const Tweet = ({ tweet }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBoxVisible, setCommentBoxVisible] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const { data: session } = useSession();

  const refreshComments = async () => {
    const comments: Comment[] = await fetchComments(tweet._id);

    setComments(comments);
  };

  const postComment = async () => {
    const commentBody: CommentBody = {
      comment: input,
      username: session?.user?.name || "Unknown User",
      profileImg: session?.user?.image || "https://links.papareact.com/gll",
      tweetId: tweet._id,
    };

    const result = await fetch(`/api/addComments`, {
      body: JSON.stringify(commentBody),
      method: "POST",
    });

    const json = await result.json();

    return json;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const commentToast = toast.loading("Posting comment...");

    postComment();

    toast.success("Comment Posted!", {
      id: commentToast,
    });

    setInput("");
    setCommentBoxVisible(false);
    refreshComments();
  };

  useEffect(() => {
    refreshComments();
  }, []);

  return (
    <div className={styles.tweet}>
      <div className={styles.tweetInfo}>
        <img src={tweet.profileImg} alt="" />

        <div className={styles.info}>
          <div className={styles.header}>
            <p className={styles.username}>{tweet.username}</p>
            <p className={styles.usernameNoSpace}>
              {tweet.username.replace(/\s+/g, "").toLowerCase()} •
            </p>

            <TimeAgo className={styles.createdAt} date={tweet._createdAt} />
          </div>

          <p className="pt-1">{tweet.text}</p>

          {tweet.image && <img src={tweet.image} alt="" />}
        </div>
      </div>

      <div className={styles.iconsWrapper}>
        <div
          onClick={() => session && setCommentBoxVisible((prev) => !prev)}
          className={styles.iconWrapper}
        >
          <HiOutlineChatAlt2 className="h-5 w-5" />
          <p>{comments.length}</p>
        </div>

        <div className={styles.iconWrapper}>
          <HiOutlineSwitchHorizontal className="h-5 w-5" />
        </div>

        <div className={styles.iconWrapper}>
          <AiOutlineHeart className="h-5 w-5" />
        </div>

        <div className={styles.iconWrapper}>
          <AiOutlineUpload className="h-5 w-5" />
        </div>
      </div>

      {commentBoxVisible && (
        <form onSubmit={handleSubmit} className={styles.commentBox}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Write a comment..."
          />
          <button type="submit" disabled={!session || !input}>
            Post
          </button>
        </form>
      )}

      {comments?.length > 0 && (
        <div className={styles.comments}>
          {comments.map((comment) => (
            <div className={styles.comment} key={comment._id}>
              <hr className={styles.horizRow} />

              <img src={comment.profileImg} alt="" />

              <div className={styles.commentInfo}>
                <div className={styles.senderInfo}>
                  <p className={styles.commentSenderName}>{comment.username}</p>
                  <p className={styles.commentSenderNameHashtag}>
                    @{comment.username.replace(/\s+/g, "").toLowerCase()}
                  </p>
                  <TimeAgo
                    className={styles.createdAt}
                    date={comment._createdAt}
                  />
                </div>
                <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tweet;
