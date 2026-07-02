
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import { useProfile } from "../context/ProfileContext";
import { FaUserCircle } from "react-icons/fa";
import Auth from "../Services/Auth.model";
import Project from "../Services/Project.model";
export default function EditProfile() {
  const navigate = useNavigate();
const [departments, setDepartments] = useState([]);
  const { profileImage, saveProfileImage } = useProfile();

  const [previewImage, setPreviewImage] = useState(profileImage);
const [profileImageFile, setProfileImageFile] = useState(null);
const [formData, setFormData] = useState({
  full_name: "",
  track_name: "AI",
  department_id: "",
  gpa: "",
  phone: "",
  email: "",
});

  useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const response = await Project.getDepartments();
      console.log("Departments:", response);
      setDepartments(response);
    } catch (error) {
      console.log("Failed to fetch departments", error);
    }
  };

  fetchDepartments();
}, []);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (file) {
    setProfileImageFile(file);

    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = new FormData();

    data.append("full_name", formData.full_name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("track_name", formData.track_name);
    data.append("department_id", formData.department_id);
    data.append("gpa", formData.gpa);

    if (profileImageFile) {
      data.append("profile_image_url", profileImageFile);
    }

    await Auth.updateProfile(data);

    saveProfileImage(previewImage);

    alert("Profile updated successfully");

    navigate("/doctor");
  } catch (error) {
    console.log(error);

    alert("Failed to update profile");
  }
};
  return (
    <div className="flex  bg-gray-50">
      {/* Sidebar */}
    

      {/* Main */}
      <div className="flex-1 flex flex-col ">
       

        <div className="">
          {/* Header Section */}
          <div className=" p-3 mb-1 flex items-center gap-6">
            {/* Profile Image */}
            <label className="relative cursor-pointer">
              {previewImage ? (
                <img
                  src={previewImage}
                  className="w-32 h-32 rounded-full object-cover "
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-black  flex items-center justify-center">
                  <FaUserCircle className="text-white text-5xl" />
                </div>
              )}

              <div className="absolute bottom-0 right-0 bg-gray-200 p-2 rounded-full">
                <FaCamera />
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Title */}
            <h1 className="text-3xl font-bold text-blue-600">Edit Profile</h1>
          </div>

          {/* Form */}
<form onSubmit={handleSubmit} className="p-6">
  
  {/* Fields Grid */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Name */}
            <div>
              <label className="block  mb-2 font-medium">Name</label>
              <input
                name="full_name"
  value={formData.full_name}
                onChange={handleChange}
                className="w-full  bg-white  rounded-md px-4 py-2"
              />
            </div>


            {/* Track */}
            <div>
              <label className="block mb-2 font-medium">Track</label>
              <select
               name="track_name"
  value={formData.track_name}
                onChange={handleChange}
                className="w-full  border-0  rounded-md px-4 py-2"
              >
                <option>AI</option>
                <option>Data Science</option>
                <option>Software Engineering</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block mb-2 font-medium">Department</label>
<select
  name="department_id"
  value={formData.department_id}
  onChange={handleChange}
  className="w-full border-0 rounded-md px-4 py-2"
>
  <option value="">Select Department</option>

  {Array.isArray(departments) &&
    departments.map((dept) => (
      <option key={dept.id} value={dept.id}>
        {dept.name}
      </option>
    ))}
</select>
            </div>

            {/*  GPA */}
            <div>
              <label className="block mb-2 font-medium">GPA</label>
<input
  type="number"
  name="gpa"
  value={formData.gpa}
  onChange={handleChange}
  className="w-full border-0 rounded-md px-4 py-2"
/>
            </div>

            {/* City */}


            {/* Phone */}
            <div>
              <label className="block mb-2 font-medium">Phone Number</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border-0 bg-white  rounded-md px-4 py-2"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full  bg-white  rounded-md px-4 py-2"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-0  bg-white rounded-md px-4 py-2"
              />
            </div>
  </div>

  {/* Submit Button */}
  <div className="mt-8 flex justify-center">
    <button
      type="submit"
      className="bg-blue-600 text-white px-16 py-4 rounded-md hover:bg-blue-700 transition"
    >
      Save Changes
    </button>
  </div>


          </form>
        </div>
      </div>
    </div>
  );

}
