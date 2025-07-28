import React, { useState } from "react";
import { MdClose, MdOutlineCloudUpload } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { updateCoverImg } from "../store/Slices/authSlice";
import GetImagePreview from "./GetImagePreview";

//   EDIT COVER COMPONENT
//   Renders a popup to upload and update the user's cover image
function EditCover({ preImage }) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  //   HANDLE COVER UPLOAD
  //   Dispatches an action to update the cover image in the backend
  const upload = (data) => {
    setIsOpen(false);
    const formData = new FormData();
    formData.append("coverImage", data.cover[0]);

    if (data) {
      dispatch(updateCoverImg(formData));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(upload)} className="relative">
        {/* Upload Icon to trigger popup */}
        <MdOutlineCloudUpload
          className="hover:text-gray-200 text-black rounded-md bg-white opacity-80 hover:opacity-100 p-1 cursor-pointer"
          size={35}
          onClick={() => setIsOpen((prev) => !prev)}
        />

        {/* Popup Modal */}
        {isOpen && (
          <div className="fixed z-50 top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-70">
            <div className="bg-black p-8 relative border shadow-lg w-full max-w-md">
              {/* Close button */}
              <button
                className="absolute top-5 right-5 text-white hover:text-gray-200"
                onClick={() => setIsOpen(false)}
              >
                <MdClose size={20} />
              </button>

              {/* Modal Content */}
              <h2 className="text-lg font-bold text-white mb-4">
                Change Cover Picture
              </h2>
              <div className="flex flex-col items-center">
                <GetImagePreview
                  name={"cover"}
                  control={control}
                  cameraIcon
                  cameraSize={30}
                  className="w-full h-full object-contain min-h-20 max-h-60 bg-[#222222]"
                  image={preImage}
                />
                <button
                  type="submit"
                  className="bg-purple-500 text-white px-4 py-2 mt-4 w-full"
                >
                  Upload
                </button>
              </div>
              {errors.cover && (
                <span className="text-red-500">{errors.cover.message}</span>
              )}
            </div>
          </div>
        )}
      </form>
    </>
  );
}

export default EditCover;
