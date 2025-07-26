import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  loading: false,
  subscribed: null,
  channelSubscribers: [],
  mySubscriptions: [],
};

//   TOGGLE SUBSCRIPTION
//   Subscribes/unsubscribes the logged-in user to a channel.
export const toggleSubscription = createAsyncThunk(
  "toggleSubscription",
  async (channelId) => {
    try {
      const response = await axiosInstance.post(`subscriptions/c/${channelId}`);
      return response.data.data.subscribed;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

//   FETCH CHANNEL SUBSCRIBERS
//   Retrieves all subscribers of a specific channel.
export const getUserChannelSubscribers = createAsyncThunk(
  "getUserChannelSubscribers",
  async (channelId) => {
    try {
      const response = await axiosInstance.get(`subscriptions/c/${channelId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

//   FETCH MY SUBSCRIPTIONS
//   Retrieves all channels the logged-in user is subscribed to.
export const getSubscribedChannels = createAsyncThunk(
  "getSubscribedChannels",
  async (subscriberId) => {
    try {
      const response = await axiosInstance.get(
        `subscriptions/u/${subscriberId}`
      );
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // TOGGLE SUBSCRIPTION
    builder.addCase(toggleSubscription.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(toggleSubscription.fulfilled, (state, action) => {
      state.loading = false;
      state.subscribed = action.payload;
    });

    // FETCH CHANNEL SUBSCRIBERS
    builder.addCase(getUserChannelSubscribers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserChannelSubscribers.fulfilled, (state, action) => {
      state.loading = false;
      state.channelSubscribers = action.payload;
    });

    // FETCH MY SUBSCRIPTIONS
    builder.addCase(getSubscribedChannels.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getSubscribedChannels.fulfilled, (state, action) => {
      state.loading = false;
      // Filters subscriptions to only include those with a latest video
      state.mySubscriptions = action.payload.filter(
        (subscription) => subscription?.subscribedChannel?.latestVideo
      );
    });
  },
});

export default subscriptionSlice.reducer;
