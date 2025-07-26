import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";

// Initial user-related state
const initialState = {
  loading: false,
  profileData: null,
  history: [],
};

//   GET USER CHANNEL PROFILE
//   Fetches profile info of a user by username
export const userChannelProfile = createAsyncThunk(
  "getUserChannelProfile",
  async (username) => {
    try {
      const response = await axiosInstance.get(`/users/c/${username}`);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

//   GET WATCH HISTORY
//   Fetches watch history of the logged-in user
export const getWatchHistory = createAsyncThunk("getWatchHistory", async () => {
  try {
    const response = await axiosInstance.get("/users/watch-history");
    return response.data.data;
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.error);
    throw error;
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // FETCH CHANNEL PROFILE
    builder.addCase(userChannelProfile.pending, (state) => {
      state.loading = true; // Set loading state
    });
    builder.addCase(userChannelProfile.fulfilled, (state, action) => {
      state.loading = false; // Reset loading state
      state.profileData = action.payload; // Store profile data from API
    });

    // FETCH WATCH HISTORY
    builder.addCase(getWatchHistory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getWatchHistory.fulfilled, (state, action) => {
      state.loading = false; 
      state.history = action.payload; // Store watch history data from API
    });
  },
});

export default userSlice.reducer;
