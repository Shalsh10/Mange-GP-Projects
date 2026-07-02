import { createContext, useContext, useState } from "react";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  // Load name and image from localStorage or fallback
  const [profileName, setProfileName] = useState(() => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    return user?.name || user?.full_name || localStorage.getItem("profileName") || "Ahmed Khaled";
  });

  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem("profileImage") || "";
  });

  const saveProfile = (img, name, extraData = {}) => {
    if (img) {
      setProfileImage(img);
      localStorage.setItem("profileImage", img);
    }
    if (name) {
      setProfileName(name);
      localStorage.setItem("profileName", name);
    }

    // Update the full user object in localStorage to persist across updates
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const updatedUser = {
        ...user,
        name: name || user.name,
        full_name: name || user.full_name,
        image: img || user.image,
        ...extraData
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <ProfileContext.Provider
      value={{ profileName, profileImage, saveProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);