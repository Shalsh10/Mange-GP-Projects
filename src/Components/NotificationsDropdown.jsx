import { useNavigate } from "react-router-dom";
const NotificationsDropdown = () => {
    const navigate = useNavigate();
  return (
    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg p-4 z-50">
      <h3 className="text-lg font-semibold mb-3">Notifications</h3>

      {/* Tabs */}
      <div className="flex gap-4 text-sm border-b pb-2 mb-3">
        <span className="text-blue-600 border-b-2 border-blue-600 pb-1">
          All
        </span>
        <span className="text-gray-500">Unread</span>
        <span className="text-gray-500">Read</span>
      </div>

      {/* Notification Item */}
      <div className="bg-blue-50 p-3 rounded-lg mb-3">
        <p className="text-sm">
          <span className="font-medium">Dennisa Nedry</span> requested to join your team
        </p>

        <div className="flex gap-2 mt-2">
          <button className="bg-red-500 text-white px-3 py-1 rounded text-xs">
            Accept
          </button>
          <button className="border px-3 py-1 rounded text-xs">
            Reject
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Last Wednesday at 9:42 AM
        </p>
      </div>

      {/* Another item */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm">
          DN
        </div>
        <div>
          <p className="text-sm font-medium">Dennisa Nedry</p>
          <p className="text-xs text-gray-500">leaved a note</p>
        </div>
      </div>

      <hr className="my-3" />

      <p className="text-sm text-gray-500 mb-3">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit...
      </p>

      <div className="text-center">
<button
  onClick={() => navigate("/notifications")}
  className="text-blue-600 text-sm hover:underline"
>
  See All Notifications
</button>
      </div>
    </div>
  );
};
export default NotificationsDropdown;