import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";

// Initial state
const initialState = {
    loading: false,
    tweets: [],
};

//   CREATE TWEET
//   Posts a new tweet to the backend
export const createTweet = createAsyncThunk("createTweet", async (content) => {
    try {
        const response = await axiosInstance.post("/tweet", content);
        toast.success(response.data?.message);
        return response.data.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        throw error;
    }
});

//   EDIT TWEET
//   Updates a tweet's content
export const editTweet = createAsyncThunk(
    "editTweet",
    async ({ tweetId, content }) => {
        try {
            const response = await axiosInstance.patch(`/tweet/${tweetId}`, { content });
            toast.success(response.data.message);
            return response.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.error);
            throw error;
        }
    }
);

//   DELETE TWEET
//   Removes a tweet by its ID
export const deleteTweet = createAsyncThunk("deleteTweet", async (tweetId) => {
    try {
        const response = await axiosInstance.delete(`/tweet/${tweetId}`);
        toast.success(response.data.message);
        return response.data.data.tweetId;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        throw error;
    }
});

//   FETCH USER TWEETS
//   Gets all tweets by a specific user
export const getUserTweets = createAsyncThunk("getUserTweets", async (userId) => {
    try {
        const response = await axiosInstance.get(`/tweet/user/${userId}`);
        return response.data.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        throw error;
    }
});

// Slice
const tweetSlice = createSlice({
    name: "tweet",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // FETCH USER TWEETS
        builder.addCase(getUserTweets.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getUserTweets.fulfilled, (state, action) => {
            state.loading = false;
            state.tweets = action.payload;
        });

        // CREATE TWEET
        builder.addCase(createTweet.fulfilled, (state, action) => {
            state.tweets.unshift(action.payload); // Add new tweet at top
        });

        // DELETE TWEET
        builder.addCase(deleteTweet.fulfilled, (state, action) => {
            state.tweets = state.tweets.filter((tweet) => tweet._id !== action.payload);
        });
    },
});

// Actions
export const { addTweet } = tweetSlice.actions;

// Reducer
export default tweetSlice.reducer;
