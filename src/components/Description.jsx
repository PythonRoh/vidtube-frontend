import React, { useState } from "react";
import { timeAgo } from "../helpers/timeAgo";
import { Like, Button } from "./index";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toggleSubscription } from "../store/Slices/subscriptionSlice";

function Description({
  title,
  views,
  createdAt,
  channelName,
  avatar,
  subscribersCount,
  likesCount,
  isSubscribed,
  description,
  isLiked,
  videoId,
  channelId,
}) {
  // Local state to reflect immediate UI change on subscribe toggle
  const [localIsSubscribed, setLocalIsSubscribed] = useState(isSubscribed);
  const [localSubscribersCount, setLocalSubscribersCount] =
    useState(subscribersCount);

  const dispatch = useDispatch();

  //   HANDLE SUBSCRIBE TOGGLE
  //   Updates local state first for instant UI feedback and then dispatches redux action
  const handleSubscribe = () => {
    dispatch(toggleSubscription(channelId));

    // Toggle local subscription state
    setLocalIsSubscribed((prev) => {
      const newState = !prev;

      // Update local subscriber count based on new state
      setLocalSubscribersCount((count) => (newState ? count + 1 : count - 1));

      return newState;
    });
  };

  return (
    <>
      <section className="sm:max-w-4xl w-full text-white sm:p-5 p-2 space-y-2">
        <div className="border-b border-slate-700">
          <div className="space-y-2 mb-2">
            {/* VIDEO TITLE */}
            <h1 className="sm:text-2xl font-semibold">{title}</h1>

            {/* VIEWS + DATE + LIKE */}
            <div className="flex items-center justify-between sm:justify-start sm:gap-5">
              <div>
                <span className="text-sm text-slate-400">{views} views . </span>
                <span className="text-sm text-slate-400">
                  {timeAgo(createdAt)}
                </span>
              </div>

              {/* LIKE BUTTON (wrapped in stylized container) */}
              <div className="rounded-full w-24 flex justify-center bg-[#222222] py-1">
                <Like
                  isLiked={isLiked}
                  videoId={videoId}
                  likesCount={likesCount}
                  size={25}
                />
              </div>
            </div>

            {/* CHANNEL INFO + SUBSCRIBE BUTTON */}
            <div className="flex gap-2 justify-between items-center">
              {/* CHANNEL LINK */}
              <Link
                to={`/channel/${channelName}/videos`}
                className="flex gap-2"
              >
                <img
                  src={avatar}
                  alt={`${channelName} avatar`} //  Accessibility fix
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h1 className="font-semibold">{channelName}</h1>
                  <p className="text-xs text-slate-400">
                    {localSubscribersCount} Subscribers
                  </p>
                </div>
              </Link>

              {/* SUBSCRIBE BUTTON */}
              <Button
                onClick={handleSubscribe}
                className="border-slate-500 hover:scale-110 transition-all text-black font-bold px-4 py-1 bg-purple-500"
              >
                {localIsSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </div>
          </div>
        </div>

        {/* VIDEO DESCRIPTION */}
        <p className="text-xs bg-[#222222] rounded-lg p-2 outline-none">
          {description}
        </p>
      </section>
    </>
  );
}

export default Description;
