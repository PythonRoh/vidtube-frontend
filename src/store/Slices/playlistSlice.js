// Redux Toolkit functions for slice and async logic
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Custom Axios instance configured with base URL and headers
import axiosInstance from "../../helpers/axiosInstance";

// Toast notifications for user feedback
import toast from "react-hot-toast";

// Initial state of the playlist slice
const initialState = {
  loading: false, // Indicates async loading status
  playlist: [], // Stores data for a single playlist
  playlists: [], // Stores all playlists created by a user
};

//   CREATE A PLAYLIST
//   Creates a new playlist with name and description.

export const createAPlaylist = createAsyncThunk(
  "createPlaylist",
  async ({ name, description }) => {
    try {
      const response = await axiosInstance.post("/playlist", {
        name,
        description,
      });
      if (response.data?.success) {
        toast.success(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

//   ADD VIDEO TO PLAYLIST
//   Sends a PATCH request to add a specific video to a playlist.

export const addVideoToPlaylist = createAsyncThunk(
  "addVideoToPlaylist",
  async ({ playlistId, videoId }) => {
    try {
      const response = await axiosInstance.patch(
        `/playlist/add/${videoId}/${playlistId}` // Both IDs as route params
      );
      if (response.data?.success) {
        toast.success(response.data.message); // Notify on success
      }
      return response.data?.data; // Return updated playlist data
    } catch (error) {
      toast.error(error?.response?.data?.error); // Show error toast
      throw error; // Rethrow for Redux to handle
    }
  }
);

//   REMOVE VIDEO FROM PLAYLIST
//   Sends a PATCH request to remove a specific video from a playlist.

export const removeVideoFromPlaylist = createAsyncThunk(
  "removeVideoFromPlaylist",
  async ({ playlistId, videoId }) => {
    try {
      const response = await axiosInstance.patch(
        `/playlist/remove/${videoId}/${playlistId}` // Both params passed
      );
      if (response.data?.success) {
        toast.success(response.data.message); // Notify on success
      }
      return response.data.data; // Return updated playlist data
    } catch (error) {
      toast.error(error?.response?.data?.error); // Show error toast
      throw error; // Rethrow to be handled by Redux
    }
  }
);

//   DELETE A PLAYLIST
//   Deletes a specific playlist by ID.

export const deletePlaylist = createAsyncThunk(
  "deletePlaylist",
  async (playlistId) => {
    try {
      const response = await axiosInstance.delete(`/playlist/${playlistId}`);
      if (response.data.success) {
        toast.success(response.data.message);
      }
      return playlistId;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

//   FETCH USER'S PLAYLISTS
//   Retrieves all playlists created by a specific user.

export const getPlaylistsByUser = createAsyncThunk(
  "getPlaylistsByUser",
  async (userId) => {
    try {
      const response = await axiosInstance.get(`/playlist/user/${userId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

//   UPDATE A PLAYLIST
//   Updates the name and description of a playlist.

export const updatePlaylist = createAsyncThunk(
  "upadtePlaylist",
  async ({ playlistId, name, description }) => {
    try {
      const response = await axiosInstance.patch(`/playlist/${playlistId}`, {
        name,
        description,
      });
      if (response.data.success) {
        toast.success(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

//   GET ALL VIDEOS IN A PLAYLIST
//   Fetches all videos in a specific playlist by ID.
export const getPlaylistById = createAsyncThunk(
  "getPlaylistById",
  async (playlistId) => {
    try {
      const response = await axiosInstance.get(`/playlist/${playlistId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

// Playlist slice definition
const playlistSlice = createSlice({
  name: "playlist", // Slice name for dev tools
  initialState, // Initial state defined above
  reducers: {}, // No synchronous reducers yet
  extraReducers: (builder) => {
    //   SET USER PLAYLISTS
    //   Sets the fetched playlists into state.
    builder.addCase(getPlaylistsByUser.fulfilled, (state, action) => {
      state.playlists = action.payload;
    });

    //  GET ALL VIDEOS IN A PLAYLIST
    //  Sets the playlist data into state after fetching.
    builder.addCase(getPlaylistById.fulfilled, (state, action) => {
      state.playlist = action.payload;
    });

    //   DELETE A PLAYLIST
    //   Removes a playlist from state after successful deletion.
    builder.addCase(deletePlaylist.fulfilled, (state, action) => {
      state.playlists = state.playlists.filter(
        (playlist) => playlist._id !== action.payload
      );
    });
  },
});

// Export reducer to be used in store
export default playlistSlice.reducer;
