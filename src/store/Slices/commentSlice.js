import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";
import { BASE_URL } from "../../constants";

//  Initial state for the comment slice
const initialState = {
  loading: false,   // To manage loading spinner while fetching comments
  comments: [],     // Array to hold comments for a video
  totalComments: null, // Total count of comments (used for pagination/UI)
  hasNextPage: false,  // Boolean flag for pagination
};

//  CREATE A COMMENT
//  Accepts videoId and content, sends to backend to create a new comment.
export const createAComment = createAsyncThunk(
  "createAComment", // action type: comment/createAComment
  async ({ videoId, content }) => {
    try {
      const response = await axiosInstance.post(`/comment/${videoId}`, {
        content,
      });
      return response.data.data; // Returns the new comment object
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error; // Thunk will be rejected
    }
  }
);

//  EDIT A COMMENT
//  Accepts commentId and new content, sends to backend to update the comment.
export const editAComment = createAsyncThunk(
  "editAComment", // action type: comment/editAComment
  async ({ commentId, content }) => {
    try {
      const response = await axiosInstance.patch(`/comment/c/${commentId}`, {
        content,
      });
      toast.success(response.data?.message);
      return response.data.data; // Return the updated comment
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

//  DELETE A COMMENT
//  Accepts commentId, sends to backend to delete the comment.
export const deleteAComment = createAsyncThunk(
  "deleteAComment", // action type: comment/deleteAComment
  async (commentId) => {
    try {
      const response = await axiosInstance.delete(`/comment/c/${commentId}`);
      toast.success(response.data.message);
      return response.data.data; // Contains { commentId: "..." }
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

//  GET VIDEO COMMENTS
//  Fetches comments for a specific video, supports pagination.
export const getVideoComments = createAsyncThunk(
  "getVideoComments", // action type: comment/getVideoComments
  async ({ videoId, page, limit }) => {
    // Construct paginated URL
    const url = new URL(`${BASE_URL}/comment/${videoId}`);
    if (page) url.searchParams.set("page", page);
    if (limit) url.searchParams.set("limit", limit);

    try {
      const response = await axiosInstance.get(url);
      return response.data.data; // Contains { docs: [], totalDocs, hasNextPage }
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

//  The actual Redux slice for comment handling
const commentSlice = createSlice({
  name: "comment",

  initialState,

  reducers: {
    //  Synchronous reducer to clear all comments from state (e.g., on logout or video switch)
    cleanUpComments: (state) => {
      state.comments = [];
    },
  },

  extraReducers: (builder) => {
    //  Fetching video comments
    builder.addCase(getVideoComments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getVideoComments.fulfilled, (state, action) => {
      state.loading = false;
      state.comments = [...state.comments, ...action.payload.docs]; // Append paginated comments
      state.totalComments = action.payload.totalDocs;
      state.hasNextPage = action.payload.hasNextPage;
    });

    //  When a comment is created successfully
    builder.addCase(createAComment.fulfilled, (state, action) => {
      state.comments.unshift(action.payload); // Add new comment to beginning
      state.totalComments++; // Increase count
    });

    //  When a comment is deleted successfully
    builder.addCase(deleteAComment.fulfilled, (state, action) => {
      state.comments = state.comments.filter(
        // what this filter does is:
        // it removes the comment with the ID that matches action.payload.commentId
        (comment) => comment._id !== action.payload.commentId // Remove deleted comment
      );
      state.totalComments--; // Decrease total count
    });

    //  Note: editAComment is likely handled through a re-fetch or local edit logic
  },
});

//  Export the clean-up reducer for external use (e.g., dispatch on logout)
export const { cleanUpComments } = commentSlice.actions;

//  Export reducer to be included in store
export default commentSlice.reducer;
