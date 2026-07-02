import { StudentNavbar } from "../../Components/StudentNavbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
       <StudentNavbar />
      <Outlet />
    </>
  );
}