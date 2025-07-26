// Redux Toolkit utilities
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Custom Axios instance (includes base URL and credentials)
import axiosInstance from "../../helpers/axiosInstance";

// Toast notification utility
import toast from "react-hot-toast";

// Initial state for the dashboard slice
const initialState = {
  loading: false, // Tracks whether a dashboard API call is in progress
  channelStats: null, // Holds statistical data for the user's channel
  channelVideos: [], // Stores the list of videos uploaded by the user
};

//  FETCH CHANNEL STATS
//  Retrieves metrics such as total videos, subscribers, views, etc.

export const getChannelStats = createAsyncThunk(
  "getChannelStats", // Action type for Redux DevTools
  async () => {
    try {
      const response = await axiosInstance.get("/dashboard/stats");
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

//  FETCH CHANNEL VIDEOS
//  Retrieves all videos uploaded by the logged-in user.

export const getChannelVideos = createAsyncThunk(
  "getChannelVideos", // Action type identifier
  async () => {
    try {
      const response = await axiosInstance.get("/dashboard/videos");
      return response.data.data; // Returns the list of videos
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

// Dashboard slice to manage channel data state
const dashboardSlice = createSlice({
  // Slice name used for Redux DevTools and action types
  name: "dashboard",

  // Initial state of the slice (defined above)
  initialState,

  // No synchronous reducers required for now
  reducers: {},

  // Handles async actions declared via createAsyncThunk
  extraReducers: (builder) => {
    //  Handle pending state for getChannelStats API call
    builder.addCase(getChannelStats.pending, (state) => {
      state.loading = true; // Show loading spinner or block UI
    });

    //  Handle successful response for getChannelStats
    builder.addCase(getChannelStats.fulfilled, (state, action) => {
      state.loading = false; // Stop loading
      state.channelStats = action.payload; // Store stats data
    });

    //  Handle pending state for getChannelVideos API call
    builder.addCase(getChannelVideos.pending, (state) => {
      state.loading = true;
    });

    //  Handle successful response for getChannelVideos
    builder.addCase(getChannelVideos.fulfilled, (state, action) => {
      state.loading = false;
      state.channelVideos = action.payload; // Update list of videos
    });
  },
});

// Export the reducer to be registered in the store
export default dashboardSlice.reducer;
