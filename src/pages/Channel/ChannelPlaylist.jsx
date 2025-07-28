import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createAPlaylist,
  getPlaylistsByUser,
  deletePlaylist,
} from "../../store/Slices/playlistSlice";
import { Button, Input } from "../../components";
import { useForm } from "react-hook-form";
import { IoCloseCircleOutline, MdDelete } from "../../components/icons";
import { timeAgo } from "../../helpers/timeAgo";
import { Link } from "react-router-dom";

function ChannelPlaylist() {
  const dispatch = useDispatch();
  const playlists = useSelector((state) => state.playlist?.playlists);
  const authId = useSelector((state) => state.auth.userData?._id);
  const userId = useSelector((state) => state.user.profileData?._id);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [openCreatePlaylist, setOpenCreatePlaylist] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(getPlaylistsByUser(userId));
    }
  }, [dispatch, userId]);

  const createPlaylist = (data) => {
    dispatch(createAPlaylist(data)).then(() => {
      dispatch(getPlaylistsByUser(userId));
    });
    setOpenCreatePlaylist((prev) => !prev);
  };

  const handleDelete = (playlistId) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      dispatch(deletePlaylist(playlistId)).then(() => {
        dispatch(getPlaylistsByUser(userId));
      });
    }
  };

  return (
    <>
      <div className="w-full relative text-white sm:px-5 px-0">
        {playlists?.length === 0 && (
          <div className="text-center h-[5rem] flex justify-center items-center">
            <h1>No Playlist Found</h1>
          </div>
        )}

        {authId === userId && (
          <div className="w-full flex justify-center mt-5">
            <Button
              className="bg-purple-500 text-sm p-2"
              onClick={() => setOpenCreatePlaylist((prev) => !prev)}
            >
              Create Playlist
            </Button>
          </div>
        )}

        {openCreatePlaylist && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-transparent z-40">
            <div className="relative w-full max-w-sm border bg-black">
              <form
                onSubmit={handleSubmit(createPlaylist)}
                className="w-full space-y-5 p-4"
              >
                <h2 className="text-2xl font-bold">Create Playlist</h2>
                <IoCloseCircleOutline
                  size={30}
                  className="absolute -top-2 right-4 cursor-pointer"
                  onClick={() => setOpenCreatePlaylist((prev) => !prev)}
                />
                <Input
                  label="Name: "
                  placeholder="Enter playlist name"
                  {...register("name", {
                    required: "name is required",
                  })}
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">
                    {errors.name.message}
                  </span>
                )}
                <Input
                  label="Description: "
                  placeholder="Enter description for your playlist"
                  {...register("description", {
                    required: "description is required",
                  })}
                />
                {errors.description && (
                  <span className="text-red-500 text-sm">
                    {errors.description.message}
                  </span>
                )}
                <Button
                  className="bg-purple-500 text-sm p-2 w-full"
                  type="submit"
                >
                  Create Playlist
                </Button>
              </form>
            </div>
          </div>
        )}

        <div className="grid xl:grid-cols-3 md:grid-cols-2 p-2 gap-5 grid-cols-1 w-full mt-5">
          {playlists?.map((playlist) => (
            <div
              key={playlist._id}
              className="relative h-[15rem] w-full border border-slate-500"
            >
              <Link
                to={`/playlist/${playlist._id}`}
                className="absolute inset-0 z-10"
              />
              <div className="absolute flex justify-between bottom-0 left-0 border-t py-1 px-2 w-full backdrop-contrast-75 z-20">
                <div className="flex flex-col gap-1">
                  <h1 className="text-lg">Playlist</h1>
                  <div className="text-xs text-slate-300">
                    {playlist.totalViews} Views &nbsp;
                    {timeAgo(playlist.updatedAt)}
                  </div>
                </div>
                <p>{playlist.totalVideos} Videos</p>
              </div>

              <div className="py-1 px-2 z-20 relative">
                <p className="text-sm font-bold">{playlist.name}</p>
                <p className="text-xs w-full h-4 overflow-hidden">
                  {playlist.description}
                </p>
                {authId === userId && (
                  <MdDelete
                    size={20}
                    className="absolute top-2 right-2 text-red-500 cursor-pointer z-30"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigating to link
                      e.preventDefault(); // Block Link redirect
                      handleDelete(playlist._id);
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ChannelPlaylist;
