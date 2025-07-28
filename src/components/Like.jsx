import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BiSolidLike, BiSolidDislike } from "../components/icons";
import {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../store/Slices/likeSlice";

function Like({ isLiked, likesCount = 0, tweetId, commentId, videoId, size }) {
  const dispatch = useDispatch();

  //   LOCAL IS LIKED STATE
  //   Maintains the local "liked" state for optimistic UI updates
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);

  //   LOCAL LIKES COUNT
  //   Tracks the displayed number of likes without waiting for backend response
  const [localLikesCount, setLocalLikesCount] = useState(likesCount);

  //   HANDLE LIKE TOGGLE
  //   Optimistically updates the like state and dispatches the appropriate Redux action
  const handleLikeToggle = () => {
    // Update local like count based on current state
    if (localIsLiked) {
      setLocalLikesCount((prev) => prev - 1);
    } else {
      setLocalLikesCount((prev) => prev + 1);
    }

    // Toggle the local like state
    setLocalIsLiked((prev) => !prev);

    // Dispatch appropriate like toggle based on the provided ID
    if (tweetId) {
      dispatch(toggleTweetLike(tweetId));
    }
    if (commentId) {
      dispatch(toggleCommentLike(commentId));
    }
    if (videoId) {
      dispatch(toggleVideoLike(videoId));
    }
  };

  //   SYNC LOCAL STATE WITH PROP CHANGES
  //   Ensures the local like state stays in sync when the parent updates `isLiked` or `likesCount`
  useEffect(() => {
    setLocalIsLiked(isLiked);
    setLocalLikesCount(likesCount);
  }, [isLiked, likesCount]);

  return (
    <>
      <div className="flex items-center gap-1">
        {/* LIKE ICON */}
        <BiSolidLike
          size={size}
          onClick={handleLikeToggle}
          className={`cursor-pointer ${localIsLiked ? "text-purple-500" : ""}`}
        />

        {/* LIKES COUNT */}
        <span className="text-xs mr-3">{localLikesCount}</span>
      </div>
    </>
  );
}

export default Like;
