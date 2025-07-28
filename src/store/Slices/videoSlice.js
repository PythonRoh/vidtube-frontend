import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";
import { BASE_URL } from "../../constants";

// Initial video-related state
const initialState = {
  loading: false,
  uploading: false,
  uploaded: false,
  videos: {
    docs: [],
    hasNextPage: false,
  },
  video: null,
  publishToggled: false,
};

//   GET ALL VIDEOS
//   Fetches videos with optional filters (userId, sort, search, pagination)
export const getAllVideos = createAsyncThunk(
  "getAllVideos",
  async ({ userId, sortBy, sortType, query, page, limit }) => {
    try {
      const url = new URL(`${BASE_URL}/videos`);
      if (userId) url.searchParams.set("userId", userId);
      if (query) url.searchParams.set("query", query);
      if (page) url.searchParams.set("page", page);
      if (limit) url.searchParams.set("limit", limit);
      if (sortBy && sortType) {
        url.searchParams.set("sortBy", sortBy);
        url.searchParams.set("sortType", sortType);
      }

      const response = await axiosInstance.get(url);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

//   PUBLISH A VIDEO
//   Uploads a new video with title, description, file & thumbnail
export const publishAvideo = createAsyncThunk("publishAvideo", async (data) => {
  // Create FormData object to handle file uploads
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("videoFile", data.videoFile[0]);
  formData.append("thumbnail", data.thumbnail[0]);

  try {
    const response = await axiosInstance.post("/videos", formData);
    toast.success(response?.data?.message);
    return response.data.data;
  } catch (error) {
    toast.error(error?.response?.data?.error);
    throw error;
  }
});

//   UPDATE A VIDEO
//   Updates title, description, and thumbnail of a video
export const updateAVideo = createAsyncThunk(
  "updateAVideo",
  async ({ videoId, data }) => {
    // Create FormData object to handle file uploads
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("thumbnail", data.thumbnail[0]);

    try {
      const response = await axiosInstance.patch(
        `/videos/${videoId}`,
        formData
      );
      toast.success(response?.data?.message);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

//   DELETE A VIDEO
//   Deletes a video by its ID
export const deleteAVideo = createAsyncThunk(
  "deleteAVideo",
  async (videoId) => {
    try {
      const response = await axiosInstance.delete(`/videos/${videoId}`);
      toast.success(response?.data?.message);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

//   GET VIDEO BY ID
//   Fetches a single video's details by ID
export const getVideoById = createAsyncThunk(
  "getVideoById",
  async ({ videoId }) => {
    try {
      const response = await axiosInstance.get(`/videos/${videoId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

//   TOGGLE PUBLISH STATUS
//   Switches the publish state (published/unpublished) of a video
export const togglePublishStatus = createAsyncThunk(
  "togglePublishStatus",
  async (videoId) => {
    try {
      const response = await axiosInstance.patch(
        `/videos/toggle/publish/${videoId}`
      );
      toast.success(response.data.message);
      return response.data.data.isPublished;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

// Slice
const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    // Resets uploading/uploaded flags after video submission
    updateUploadState: (state) => {
      state.uploading = false;
      state.uploaded = false;
    },
    // Clears loaded video docs (used on filter reset or reload)
    makeVideosNull: (state) => {
      state.videos.docs = [];
    },
  },
  extraReducers: (builder) => {
    // FETCH ALL VIDEOS
    builder.addCase(getAllVideos.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllVideos.fulfilled, (state, action) => {
      state.loading = false;
      state.videos.docs = [...state.videos.docs, ...action.payload.docs]; // Append paginated videos
      state.videos.hasNextPage = action.payload.hasNextPage;
    });

    // PUBLISH VIDEO
    builder.addCase(publishAvideo.pending, (state) => {
      state.uploading = true;
    });
    builder.addCase(publishAvideo.fulfilled, (state) => {
      state.uploading = false;
      state.uploaded = true;
    });

    // UPDATE VIDEO
    builder.addCase(updateAVideo.pending, (state) => {
      state.uploading = true;
    });
    builder.addCase(updateAVideo.fulfilled, (state) => {
      state.uploading = false;
      state.uploaded = true;
    });

    // DELETE VIDEO
    builder.addCase(deleteAVideo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteAVideo.fulfilled, (state) => {
      state.loading = false;
    });

    // GET VIDEO BY ID
    builder.addCase(getVideoById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getVideoById.fulfilled, (state, action) => {
      state.loading = false;
      state.video = action.payload;
    });

    // TOGGLE PUBLISH STATUS
    builder.addCase(togglePublishStatus.fulfilled, (state) => {
      state.publishToggled = !state.publishToggled; // Toggle state to trigger re-fetch
    });
  },
});

export const { updateUploadState, makeVideosNull } = videoSlice.actions;

export default videoSlice.reducer;
