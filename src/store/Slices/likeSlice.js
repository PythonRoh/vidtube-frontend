// Redux Toolkit utilities
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Custom Axios instance (includes base URL and credentials)
import axiosInstance from "../../helpers/axiosInstance";

// Toast notification utility
import toast from "react-hot-toast";

// Initial state for the like slice
const initialState = {
  loading: false, // Indicates loading status during async requests
  likedVideos: [], // Stores list of videos liked by the user
};

//   TOGGLE VIDEO LIKE
//   Likes or unlikes a video based on current state.

export const toggleVideoLike = createAsyncThunk(
  "toggleVideoLike", // Action type for Redux DevTools
  async (videoId) => {
    try {
      const response = await axiosInstance.post(`/likes/toggle/v/${videoId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

//   TOGGLE TWEET LIKE
//   Likes or unlikes a tweet.

export const toggleTweetLike = createAsyncThunk(
  "toggleTweetLike",
  async (tweetId) => {
    try {
      const response = await axiosInstance.post(`/likes/toggle/t/${tweetId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

//   TOGGLE COMMENT LIKE
//   Likes or unlikes a comment.

export const toggleCommentLike = createAsyncThunk(
  "toggleCommentLike",
  async (commentId) => {
    try {
      const response = await axiosInstance.post(`/likes/toggle/c/${commentId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

//   FETCH LIKED VIDEOS
//   Retrieves the list of videos the user has liked.

export const getLikedVideos = createAsyncThunk("getLikedVideos", async () => {
  try {
    const response = await axiosInstance.get("likes/videos");
    return response.data.data;
  } catch (error) {
    toast.error(error?.response?.data?.error);
    throw error;
  }
});

// Like slice to manage state related to likes
const likeSlice = createSlice({
  name: "like", // Slice name for Redux DevTools
  initialState, // Initial state declared above
  reducers: {}, // No synchronous reducers yet
  extraReducers: (builder) => {
    //  Handle pending state for getLikedVideos API call
    builder.addCase(getLikedVideos.pending, (state) => {
      state.loading = true;
    });

    //  Handle successful response for getLikedVideos
    builder.addCase(getLikedVideos.fulfilled, (state, action) => {
      state.loading = false;
      state.likedVideos = action.payload;
    });
  },
});

// Export the reducer to be added to the Redux store
export default likeSlice.reducer;
