"use client";
import React, { useState, useEffect } from "react";
import { fetchUserProfile, updateUserProfile } from "../../api/auth";
import { PROFILE_TYPE, UPDATE_PROFILE_TYPE } from "../../types/profiletype";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaPencilAlt, FaUnderline } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import Spinner from "./Spinner";

const ProfileDetails: React.FC = () => {
  const [userData, setUserData] = useState<PROFILE_TYPE | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setUserData(profile as PROFILE_TYPE);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    phone_number: Yup.string(),
    gender: Yup.string().oneOf(["male", "female", "other"]),
    birth_date: Yup.date().max(new Date(), "Invalid birth date"),
    country: Yup.string(),
    city: Yup.string(),
  });

  const handleSubmit = async (
  values: UPDATE_PROFILE_TYPE,
  { setSubmitting }: any,
) => {
  try {
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      formData.append(key, (values as any)[key]);
    });

    if (selectedFile) {
      formData.append("profile_image", selectedFile);
    }

    await updateUserProfile(formData);

    //  FORCE REFRESH FROM BACKEND
    const refreshedProfile = await fetchUserProfile();
    setUserData(refreshedProfile);

    setIsEditing(false);
    setPreviewImage(null);
    setSelectedFile(null);

  } catch (err) {
    console.error("Update error:", err);
  } finally {
    setSubmitting(false);
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const fields: Array<{
    name: keyof PROFILE_TYPE;
    label: string;
    type: string;
  }> = [
    { name: "username", label: "Username", type: "text" },
    { name: "email", label: "Email", type: "readonly" },
    { name: "phone_number", label: "Phone Number", type: "text" },
    { name: "gender", label: "Gender", type: "select" },
    { name: "birth_date", label: "Birth Date", type: "date" },
    { name: "country", label: "Country", type: "text" },
    { name: "city", label: "City", type: "text" },
  ];

 const renderField = (field: {
  name: keyof PROFILE_TYPE;
  label: string;
  type: string;
}) => {
  const value = userData?.[field.name];

  return (
    <div key={field.name} className="flex flex-col">
      <label className="mb-2 text-sm font-medium text-gray-600">
        {field.label}
      </label>

      {field.type === "readonly" ? (
        <div className="px-4 py-2 text-gray-600 bg-gray-200 border rounded-lg">
          {value ?? "-"}
        </div>
      ) : isEditing ? (
        field.type === "select" ? (
          <Field
            as="select"
            name={field.name}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Field>
        ) : (
          <Field
            name={field.name}
            type={field.type}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        )
      ) : (
        <div className="px-4 py-2 bg-white border rounded-lg shadow-sm">
          {value && value !== "" ? value : "-"}
        </div>
      )}

      <ErrorMessage
        name={field.name}
        component="div"
        className="mt-1 text-sm text-red-500"
      />
    </div>
  );
};


  return (
    <div className="px-6 py-20 bg-gradient-to-br from-purple-600 to-indigo-600">
      <div className="flex flex-col max-w-4xl gap-10 p-8 mx-auto bg-white shadow-xl rounded-2xl lg:flex-row">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img
              key={userData?.profile_image} //  forces rerender
              src={
                previewImage ||
                (userData?.profile_image
                  ? `${userData.profile_image}?t=${new Date().getTime()}`
                  : "https://via.placeholder.com/250x250.png?text=Profile")
              }
              alt="User"
              className="object-cover w-40 h-40 border-4 border-white rounded-full shadow-lg"
            />

            {isEditing && (
              <>
                {/* Camera Button */}
                <label
                  htmlFor="profileUpload"
                  className="absolute flex items-center justify-center w-10 h-10 text-white transition bg-purple-600 rounded-full shadow-md cursor-pointer bottom-2 right-2 hover:bg-purple-700"
                >
                  📷
                </label>

                <input
                  id="profileUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </>
            )}
          </div>

          {isEditing && (
            <p className="mt-3 text-sm text-gray-500">
              Click the camera icon to update profile photo
            </p>
          )}
        </div>

        {/* Basic Info Box */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Basic Information
            </h2>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-800"
              >
                <FaPencilAlt /> Edit
              </button>
            )}
          </div>

          <Formik
            initialValues={{
              username: userData?.username || "",
              email: userData?.email || "",
              phone_number: userData?.phone_number || "",
              gender: userData?.gender || "",
              birth_date: userData?.birth_date || "",
              country: userData?.country || "",
              city: userData?.city || "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className="p-6 space-y-6 border border-gray-200 bg-gray-50 rounded-xl">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {fields.map((field) => renderField(field))}
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-4 pt-4">
                    {/* Cancel Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                      }}
                      className="px-6 py-3 text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>

                    {/* Save Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-3 text-white transition bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 hover:shadow-lg"
                    >
                      <IoIosSave /> Save Changes
                    </button>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
