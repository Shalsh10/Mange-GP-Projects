import { FaBell } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import logo from "../assets/logo.png";
import NotificationsDropdown from "./NotificationsDropdown";
import { MdExpandMore } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Project from "../Services/Project.model";
import { toast } from "react-hot-toast";
import Milestones from "../Services/Milestones.model";
import { useEffect } from "react";
export const StudentNavbar = () => {
    const navigate = useNavigate();
  const [openNotif, setOpenNotif] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [milestones, setMilestones] = useState([]);
  const [milestoneId, setMilestoneId] = useState("");
  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const res = await Milestones.getOpenMilestones();

        const data = Array.isArray(res) ? res : res?.data || [];

        setMilestones(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMilestones();
  }, []);
  const openMilestones = milestones?.filter((m) => m.is_open === true) || [];
const currentMilestone = openMilestones[0];
console.log("CURRENT MILESTONE:", currentMilestone);
  const handleUpload = async () => {
    try {
      const formData = new FormData();

      formData.append("milestone_id", milestoneId);
      formData.append("notes", notes);

      if (file) {
        formData.append("files[0]", file);
      }

      const response = await Project.submitTask(formData);

      console.log(response);

      toast.success(
        () => (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <strong>Upload Task</strong>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "green", fontSize: "18px" }}>✔</span>
              <span>Your task has been submitted successfully</span>
            </div>
          </div>
        ),
        {
          duration: 3000,
        },
      );

      setShowPopup(false);

      // Reset form
      setFile(null);
      setNotes("");
      setMilestoneId("");
    } catch (error) {
      console.log("ERROR CAUGHT:", error);

      toast.error(
        () => (
          <div>
            <strong>Upload Failed</strong>
            <div>{error?.message}</div>
          </div>
        ),
        { duration: 3000 },
      );
    }
  };
  return (
    <div className="flex items-center justify-between px-8 py-3 bg-white ">
      {/* Left */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-14 w-auto" />
        {/* Center Links */}
        <div className="absolute left-1/2 -translate-x-1/2 flex gap-8 text-gray-600 font-medium">
          <span className="text-blue-600 border-b-2 border-blue-600 pb-1 cursor-pointer">
            Home
          </span>

          <span className="cursor-pointer hover:text-blue-600 transition">
            Library
          </span>

       <span
  onClick={() => navigate("/team")}
  className="cursor-pointer hover:text-blue-600 transition"
>
  My Team
</span>

   <span
  onClick={() => navigate("/timeline")}
  className="cursor-pointer hover:text-blue-600 transition"
>
  Timeline
</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        <button
          onClick={() => setShowPopup(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          <FiUpload /> Upload Task
        </button>

        {showPopup && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[350px] shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Upload Task</h2>

              <div className="mb-3">
                <label className="font-semibold block mb-1 text-[#5A5959] ">
                  File
                </label>

                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full p-2 rounded border border-[#D9D9D9]"
                />
              </div>

              <div className="mb-3">
                <label className="font-semibold block mb-1 text-[#5A5959] ">
                  Milestone
                </label>
                <select
                  value={milestoneId}
                  onChange={(e) => setMilestoneId(e.target.value)}
                  className="w-full p-2 rounded border border-[#D9D9D9]"
                >
                  <option value="">Choose milestone</option>

                  {openMilestones.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="font-semibold block mb-1 text-[#5A5959] ">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 rounded border border-[#D9D9D9]"
                  placeholder="Add any brief notes here"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="relative">
          <FaBell
            className="text-gray-600 text-lg cursor-pointer"
            onClick={() => setOpenNotif(!openNotif)}
          />

          {openNotif && <NotificationsDropdown />}
        </div>

        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://i.pravatar.cc/40"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm">Aliya Othman</span>
          <MdExpandMore />
        </div>
      </div>
    </div>
  );
};
