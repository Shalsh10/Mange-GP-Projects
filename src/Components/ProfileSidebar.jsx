import { NavLink } from "react-router-dom";
import { FaUser, FaBell, FaLock } from "react-icons/fa";
import { MdHelpOutline } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BiErrorCircle } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";

export default function ProfileSidebar() {
  return (
    <aside className="w-64 bg-[#243B56] text-white min-h-screen">

      <div className="px-6 py-4 text-lg font-semibold">
        User Info
      </div>

      <nav className="flex flex-col">

        <Item label="Edit Profile" active icon={<FaUser />} />

        <Item label="Security" icon={<FaLock />} />
        <Item label="Notifications" icon={<FaBell />} />
        <Item label="Privacy" icon={<FaLock />} />

        <div className="px-6 mt-6 text-gray-300 text-sm">
          Support and About
        </div>

        <Item label="Help & Support" icon={<MdHelpOutline />} />
        <Item label="Terms & Policies" icon={<IoDocumentTextOutline />} />
        <Item label="Report a Problem" icon={<BiErrorCircle />} />

        <div className="px-6 mt-4 text-red-500 flex items-center gap-2 cursor-pointer">
          <FiLogOut /> Log Out
        </div>

      </nav>
    </aside>
  );
}

function Item({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-6 py-3 cursor-pointer
      ${active ? "bg-blue-600" : "hover:bg-[#1d2f44]"}`}
    >
      {icon}
      {label}
    </div>
  );
}