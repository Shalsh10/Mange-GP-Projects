import { useState } from "react";

import { FaChevronLeft, FaBolt, FaCheckCircle, FaUpload } from "react-icons/fa";



function NotificationsPanel({ open, onClose }) {

  const [activeTab, setActiveTab] = useState("all");



  const notifications = [

    {

      id: 1,

      type: "request",

      name: "Dennisa Nedry",

      message: "requested to join your team",

      tag: "(Data analysis)",

      time: "Last Wednesday at 9:42 AM",

      img: "https://i.pravatar.cc/40?img=12",

    },

    {

      id: 2,

      type: "note",

      name: "Dennisa Nedry",

      message: "left a note",

      time: "Last Wednesday at 9:42 AM",

      img: "https://i.pravatar.cc/40?img=8",

    },

    {

      id: 3,

      type: "text",

      message:

        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",

      time: "Last Wednesday at 9:42 AM",

    },

    {

      id: 4,

      type: "upload",

      message: "Your Task has been uploaded",

      time: "Last Wednesday at 9:42 AM",

    },

    {

      id: 5,

      type: "reject",

      name: "Dennisa Nedry",

      message: "rejected to join your team",

      tag: "( AI )",

      time: "Last Wednesday at 9:42 AM",

      img: "https://i.pravatar.cc/40?img=4",

    },

    {

      id: 6,

      type: "success",

      name: "Dennisa Nedry",

      message: "accepted to join your team",

      tag: "( AI )",

      time: "Last Wednesday at 9:42 AM",

      img: "https://i.pravatar.cc/40?img=6",

    },

    {

      id: 7,

      type: "project",

      message: "Your Project Idea has been accepted",

      time: "Last Wednesday at 9:42 AM",

    },

  ];



  return (

    <div

      className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-xl z-50 transform transition-transform duration-300

      ${open ? "translate-x-0" : "translate-x-full"}`}

    >

      {/* Header */}

      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-200">

        <button onClick={onClose}>

          <FaChevronLeft className="text-gray-500" />

        </button>

        <h2 className="text-base font-semibold">Notifications</h2>

      </div>



      {/* Tabs */}

      <div className="flex gap-6 px-5 py-2 border-b border-gray-200 text-sm">

        {["all", "unread", "read"].map((tab) => (

          <button

            key={tab}

            onClick={() => setActiveTab(tab)}

            className={`capitalize ${

              activeTab === tab

                ? "text-red-500 border-b-2 border-red-500 pb-1"

                : "text-gray-500"

            }`}

          >

            {tab}

          </button>

        ))}

      </div>



      {/* Notifications */}

      <div className="overflow-y-auto">

        {notifications.map((n) => (

          <div key={n.id} className="px-5 py-2">

            <div className="flex gap-3">

              {/* Left icon */}

              {n.type === "text" ||

              n.type === "upload" ||

              n.type === "project" ? (

                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">

                  {n.type === "upload" ? (

                    <FaUpload size={13} />

                  ) : (

                    <FaBolt size={13} />

                  )}

                </div>

              ) : (

                <img

                  src={n.img}

                  className="w-9 h-9 rounded-full object-cover"

                />

              )}



              {/* Content */}

              <div className="flex-1 text-xs">

                {n.name && (

                  <p>

                    <span className="font-semibold">{n.name}</span> {n.message}

                    {n.tag && (

                      <span className="text-blue-500 ml-1">{n.tag}</span>

                    )}

                  </p>

                )}



                {!n.name && <p>{n.message}</p>}



                <p className="text-[11px] text-gray-400 mt-1">{n.time}</p>



                {/* Request buttons */}

                {n.type === "request" && (

                  <div className="flex gap-2 mt-1">

                    <button className="bg-red-500 text-white px-2 py-[2px] rounded text-[11px]">

                      Accept

                    </button>



                    <button className="bg-gray-200 px-2 py-[2px] rounded text-[11px]">

                      Reject

                    </button>

                  </div>

                )}



                {/* Success icon */}

                {n.type === "project" && (

                  <div className="text-green-600 mt-1">

                    <FaCheckCircle size={13} />

                  </div>

                )}



                {/* Rejected */}

                {n.type === "reject" && (

                  <p className="text-red-500 text-[11px] mt-1">Rejected</p>

                )}

              </div>

            </div>



            {/* Divider */}

            <div className="mt-2 border-t border-gray-200 mx-2"></div>

          </div>

        ))}

      </div>

    </div>

  );

}



export default NotificationsPanel;