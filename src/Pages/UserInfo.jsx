import React from "react";
import { Outlet } from "react-router-dom";
import {StudentNavbar} from "../Components/StudentNavbar";
import StudentSidebar from "../Components/StudentSidebar";

function UserInfo() {
  return (
    <div className="flex min-h-screen ">
      
      {/* Sidebar ثابت */}
      <StudentSidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        
        {/* Navbar ثابت */}
        <StudentNavbar />

        {/* المحتوى بيتغير هنا */}
        <main className="p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default UserInfo;