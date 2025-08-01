import React, { useState } from "react";
import { MdClose, MdOutlineCloudUpload } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { updateAvatar, updateCoverImg } from "../store/Slices/authSlice";
import GetImagePreview from "./GetImagePreview";

// This is using object destructuring directly in the function parameters. It means:
//      When EditAvatar is called, it expects to receive a single object argument
//      That object should contain the properties cover and preImage
//      These two properties will be automatically extracted (destructured) into local variables inside the function

function EditAvatar({ cover, preImage }) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  // useForm is a hook from react-hook-form that helps manage form state and validation
  // Here, we are initializing it without any default values
  // The control object is used to connect the form inputs with react-hook-form
  // handleSubmit is a function that will be called when the form is submitted
  // formState contains information about the form's state, including any validation errors
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const upload = (data) => {
    setIsOpen(false);
    const formData = new FormData();
    // If cover is true, we are updating the cover image, otherwise we are updating the avatar
    formData.append(`${cover ? "coverImage" : "avatar"}`, data.avatar[0]);

    if (data) {
      if (cover) {
        dispatch(updateCoverImg(formData));
      } else {
        dispatch(updateAvatar(data.avatar[0])); // send raw File object
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(upload)} className="relative">
        {/* Popup */}
        <MdOutlineCloudUpload
          className="hover:text-gray-200 text-black rounded-md bg-white opacity-80 hover:opacity-100 p-1 cursor-pointer"
          size={35}
          onClick={() => setIsOpen((prev) => !prev)}
        />
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

              {/* Content */}
              <h2 className="text-lg font-bold text-white mb-4">
                Change {cover ? "Cover" : "Profile"} Picture
              </h2>
              <div className="flex flex-col items-center">
                <GetImagePreview
                  name={"avatar"}
                  control={control}
                  cameraIcon
                  cameraSize={30}
                  className={
                    "w-full h-full object-contain min-h-20 max-h-60 bg-[#222222]"
                  }
                  image={preImage}
                />
                <button
                  type="submit"
                  className="bg-purple-500 text-white px-4 py-2 mt-4 w-full"
                >
                  Upload
                </button>
              </div>
              {errors.avatar && (
                <span className="text-red-500">{errors.avatar.message}</span>
              )}
            </div>
          </div>
        )}
      </form>
    </>
  );
}

export default EditAvatar;
