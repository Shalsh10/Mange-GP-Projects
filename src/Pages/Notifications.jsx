import { useState } from "react";
import {StudentNavbar} from "../Components/StudentNavbar";
const Notifications = () => {
  const [tab, setTab] = useState("all");

  return (
    
    <div className="bg-gray-100 min-h-screen ">
     <Navbar />
      <h2 className="text-xl font-semibold mb-4 mt-9 ">Notifications</h2>

      <div className="bg-white rounded-xl shadow p-6">
        {/* Tabs */}
        <div className="flex gap-6 border-b mb-4 text-sm">
          <button
            onClick={() => setTab("all")}
            className={`pb-2 ${
              tab === "all"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setTab("unread")}
            className={`pb-2 ${
              tab === "unread"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            Unread
          </button>

          <button
            onClick={() => setTab("read")}
            className={`pb-2 ${
              tab === "read"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            Read
          </button>
        </div>

        {/* Notification Item 1 */}
        <div className="py-4 border-b">
          <div className="flex gap-3">
            <img
              src="https://i.pravatar.cc/40"
              className="w-10 h-10 rounded-full"
            />

            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium">Dennisa Nedry</span> requested to
                join your team
              </p>

              <p className="text-xs text-gray-500">( Data analyst )</p>

              <div className="flex gap-2 mt-2">
                <button className="bg-red-500 text-white px-3 py-1 rounded text-xs">
                  Accept
                </button>
                <button className="border border-[#D9D9D9] px-3 py-1 rounded text-xs">
                  Reject
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Last Wednesday at 9:42 AM
              </p>
            </div>
          </div>
        </div>

        {/* Notification Item 2 */}
        <div className="py-4 border-b flex gap-3">
          <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm">
            DN
          </div>

          <div>
            <p className="text-sm">
              <span className="font-medium">Dennisa Nedry</span> leaved a note
            </p>
            <p className="text-xs text-gray-400">
              Last Wednesday at 9:42 AM
            </p>
          </div>
        </div>

        {/* Notification Item 3 */}
        <div className="py-4 border-b">
          <p className="text-sm text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Last Wednesday at 9:42 AM
          </p>
        </div>

        {/* Notification Item 4 */}
        <div className="py-4 border-b flex justify-between">
          <p className="text-sm">Your Project Idea has been rejected</p>
          <span className="text-red-500">✕</span>
        </div>

        {/* Notification Item 5 */}
        <div className="py-4 border-b">
          <p className="text-sm">
            <span className="font-medium">Dennisa Nedry</span> accepted to join
            your team
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Last Wednesday at 9:42 AM
          </p>
        </div>

        {/* Notification Item 6 */}
        <div className="py-4 border-b flex justify-between">
          <p className="text-sm">Your Task hasn't been uploaded</p>
          <span className="text-red-500">⚠</span>
        </div>

        {/* Notification Item 7 */}
        <div className="py-4 flex gap-3">
          <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm">
            DN
          </div>

          <div>
            <p className="text-sm">
              <span className="font-medium">Dennisa Nedry</span> leaved a note
            </p>
            <p className="text-xs text-gray-400">
              Last Wednesday at 9:42 AM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;