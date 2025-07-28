import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPlaylistById,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../store/Slices/playlistSlice";
import { VideoList } from "../components";

function PlaylistDetail() {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth?.userData);
  const { playlist } = useSelector((state) => state.playlist);

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Fetch playlist on load
  useEffect(() => {
    if (playlistId) {
      dispatch(getPlaylistById(playlistId));
    }
  }, [dispatch, playlistId]);

  // Set form values when playlist is loaded
  useEffect(() => {
    if (playlist) {
      setName(playlist.name || "");
      setDescription(playlist.description || "");
    }
  }, [playlist]);

  // Update playlist
  const handleUpdate = () => {
    dispatch(updatePlaylist({ playlistId, name, description })).then(() =>
      setEditMode(false)
    );
  };

  // Delete playlist
  const handleDelete = () => {
    dispatch(deletePlaylist(playlistId)).then(() => {
      navigate("/my-playlists");
    });
  };

  // Remove a video from the playlist
  const handleRemove = (videoId) => {
    dispatch(removeVideoFromPlaylist({ playlistId, videoId }));
  };

  if (!playlist)
    return <p className="text-center mt-10 text-white">Loading Playlist...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        {editMode ? (
          <div className="w-full space-y-2">
            <input
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Playlist Name"
            />
            <textarea
              className="w-full p-2 border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="ml-2 text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-white">{playlist.name}</h1>
            <p className="text-gray-400">{playlist.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              {playlist?.owner?.username} • {playlist?.totalVideos} videos •{" "}
              {playlist?.totalViews} views
            </p>
          </div>
        )}

        {!editMode && (
          <div className="space-x-2">
            <button
              onClick={() => setEditMode(true)}
              className="text-sm px-3 py-1 border rounded text-white"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-sm px-3 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {playlist.videos?.length > 0 ? (
          playlist.videos.map((video) => (
            <div key={video._id} className="relative">
              <VideoList
                thumbnail={video.thumbnail?.url || video.thumbnail}
                duration={video.duration}
                title={video.title}
                views={video.views}
                avatar={playlist.owner?.avatar?.url}
                channelName={playlist.owner?.username}
                createdAt={video.createdAt}
                videoId={video._id}
              />

              <button
                onClick={() => handleRemove(video._id)}
                className="absolute top-2 right-2 bg-white border rounded-full p-1 text-xs hover:bg-red-500 hover:text-white"
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <p className="text-white">No videos in this playlist.</p>
        )}
      </div>
    </div>
  );
}

export default PlaylistDetail;
