import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";

// Initial state for auth slice
const initialState = {
  loading: false, // Tracks API loading state
  status: false, // Whether user is logged in
  userData: null, // Stores authenticated user data
};

// REGISTER USER
// Accepts form data (including file uploads) and sends to backend to create a new account.

export const createAccount = createAsyncThunk("register", async (data) => {
  // Create FormData object to handle file uploads
  const formData = new FormData(); // Used for multipart/form-data (for avatar and cover image)
  formData.append("avatar", data.avatar[0]);
  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("fullName", data.fullName);
  if (data.coverImage) {
    formData.append("coverImage", data.coverImage[0]);
  }

  try {
    const response = await axiosInstance.post("/users/register", formData);
    console.log(response.data);
    toast.success("Registered successfully!!!");
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.error);
    throw error;
  }
});

// LOGIN USER
// Sends email/password and receives authenticated user data.

export const userLogin = createAsyncThunk("login", async (data) => {
  try {
    const response = await axiosInstance.post("/users/login", data);

    // why data.data.user?
    // axios returns response in the format { data: { data: { user: ... } } }
    return response.data.data.user; // Only return user object
  } catch (error) {
    toast.error(error?.response?.data?.error);
    throw error;
  }
});

// LOGOUT USER
// Clears session cookies/token and resets auth state.

export const userLogout = createAsyncThunk("logout", async () => {
  try {
    const response = await axiosInstance.post("/users/logout");
    toast.success(response.data?.message);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.error);
    throw error;
  }
});

// REFRESH ACCESS TOKEN
// Typically used to keep the user logged in via refresh token.

export const refreshAccessToken = createAsyncThunk(
  "refreshAccessToken",
  async (data) => {
    try {
      const response = await axiosInstance.post("/users/refresh-token", data);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

// CHANGE PASSWORD
// Updates password securely.

export const changePassword = createAsyncThunk(
  "changePassword",
  async (data) => {
    try {
      const response = await axiosInstance.post("/users/change-password", data);
      toast.success(response.data?.message);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

// GET CURRENT USER
// Used to fetch authenticated user info from token/session.

export const getCurrentUser = createAsyncThunk("getCurrentUser", async () => {
  const response = await axiosInstance.get("/users/current-user");
  // axios returns response in the format { data: { data: ... } }
  return response.data.data;
});

// UPDATE AVATAR
// Updates the profile picture (avatar).

export const updateAvatar = createAsyncThunk("updateAvatar", async (file) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file); // must match multer field name

    const response = await axiosInstance.patch("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Avatar updated successfully!");
    return response.data.data;
  } catch (error) {
    toast.error(error?.response?.data?.error || "Something went wrong!");
    throw error;
  }
});

// UPDATE COVER IMAGE

export const updateCoverImg = createAsyncThunk(
  "updateCoverImg",
  async (coverImage) => {
    try {
      const response = await axiosInstance.patch(
        "/users/cover-image?",
        coverImage
      );
      toast.success(response.data?.message);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

// UPDATE USER DETAILS
// Updates profile info like name, email, etc.

export const updateUserDetails = createAsyncThunk(
  "updateUserDetails",
  async (data) => {
    try {
      const response = await axiosInstance.patch("/users/update-account", data);
      toast.success("Updated details successfully!!!");
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

// AUTH SLICE
// Contains reducers and extraReducers to handle above async actions.

const authSlice = createSlice({
  // This slice is responsible for handling all "auth"-related state
  name: "auth",

  // Initial state of the auth slice
  initialState, // Defined earlier as: { loading: false, status: false, userData: null }

  // Synchronous reducers (none defined here, so it's empty)
  reducers: {},

  // Handle async actions (createAsyncThunk) using extraReducers
  extraReducers: (builder) => {
    //  REGISTER USER
    builder.addCase(createAccount.pending, (state) => {
      state.loading = true; // Show spinner/loading while register API is processing
    });
    builder.addCase(createAccount.fulfilled, (state) => {
      state.loading = false; // Stop spinner when registration is done
      // No userData updated because registration doesn't log user in
    });

    //  LOGIN USER
    builder.addCase(userLogin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true; // Set user as authenticated
      state.userData = action.payload; // Save user info from API response
    });

    //  LOGOUT USER
    builder.addCase(userLogout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(userLogout.fulfilled, (state) => {
      state.loading = false;
      state.status = false; // User is no longer authenticated
      state.userData = null; // Clear stored user data
    });

    //  GET CURRENT USER (e.g. on app load or refresh)
    builder.addCase(getCurrentUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true; // Mark user as authenticated
      state.userData = action.payload; // Store current user data
    });
    builder.addCase(getCurrentUser.rejected, (state) => {
      state.loading = false;
      state.status = false; // Couldn't fetch user, maybe token expired
      state.userData = null; // Clear user data just in case
    });

    //  UPDATE AVATAR
    builder.addCase(updateAvatar.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateAvatar.fulfilled, (state, action) => {
      state.loading = false;
      state.userData = action.payload; // Update user data with new avatar
    });
    builder.addCase(updateAvatar.rejected, (state) => {
      state.loading = false; // API failed, just stop spinner
    });

    //  UPDATE COVER IMAGE
    builder.addCase(updateCoverImg.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateCoverImg.fulfilled, (state, action) => {
      state.loading = false;
      state.userData = action.payload; // Update user data with new cover image
    });
    builder.addCase(updateCoverImg.rejected, (state) => {
      state.loading = false;
    });

    //  UPDATE USER DETAILS (e.g., name, email, bio)
    builder.addCase(updateUserDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUserDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.userData = action.payload; // Replace old user info with updated info
    });
  },
});

// Export reducer to be used in the store
export default authSlice.reducer;
