import React, { useEffect } from "react";
import { Input2, Button } from "../components";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetails } from "../store/Slices/authSlice";

function EditPersonalInfo() {
  //   REACT HOOK FORM SETUP
  //   useForm hook to manage form state and validation
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const dispatch = useDispatch();

  //   SELECT LOGGED-IN USER DATA FROM STORE
  const auth = useSelector((state) => state.auth?.userData);

  //   PREFILL FORM WITH USER DATA ON LOAD
  //   Sets initial values from auth into form fields using setValue
  useEffect(() => {
    setValue("fullName", auth?.fullName);
    setValue("email", auth?.email);
  }, [auth, setValue]);

  //   HANDLE FORM SUBMISSION
  //   Dispatch redux action to update the user details
  const saveChanges = (data) => {
    dispatch(updateUserDetails(data));
  };

  //   RESET FORM FIELDS TO ORIGINAL USER DATA
  const reset = (e) => {
    e.preventDefault();
    setValue("fullName", auth?.fullName);
    setValue("email", auth?.email);
  };

  return (
    <>
      <div className="w-full text-white flex justify-center items-center mt-5">
        <div className="bg-transparent p-5 border rounded shadow-lg w-full max-w-md">
          <h2 className="text-lg font-bold mb-4">
            Personal Information
            <p className="font-light text-xs">
              Update your personal details here.
            </p>
          </h2>

          {/* FORM */}
          <form onSubmit={handleSubmit(saveChanges)} className="space-y-4">
            {/* FULL NAME INPUT */}
            <div className="flex flex-col">
              <Input2
                label="Full Name"
                type="text"
                className="rounded"
                {...register("fullName", {
                  required: "FullName is required",
                })}
              />
              {errors.fullName && (
                <span className="text-sm text-red-500">
                  {errors.fullName?.message}
                </span>
              )}
            </div>

            {/* EMAIL INPUT */}
            <div className="flex flex-col">
              <Input2
                label="Email Address"
                type="email"
                className="rounded"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email?.message}
                </span>
              )}
            </div>

            {/* BUTTONS: RESET & SAVE */}
            <div className="flex justify-between mt-4">
              {/* RESET TO ORIGINAL USER DATA */}
              <Button
                onClick={(e) => reset(e)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Reset
              </Button>

              {/* SUBMIT UPDATED FORM */}
              <Button
                type="submit"
                className="bg-purple-500 text-white px-4 py-2 rounded"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditPersonalInfo;
