

// Reusable Navbar

// Main Page
const Dashboard = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="flex gap-6 p-6">
        {/* Left Content */}
        <div className="flex-1">
          {/* Hero */}
          <div className="relative  overflow-hidden h-56">
            <img
              src={landing}
              className="absolute w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative flex flex-col items-center justify-center h-full ">
              <h2 className="text-2xl font-semibold mb-4 text-white">Welcome AI</h2>

         
<div className="flex items-center bg-white rounded-full px-5 py-3 w-[800px] mt-6 shadow-md">
                <FaSearch className="text-gray-400" />
                <input
                  placeholder="Search Projects or Students"
                  className="ml-3 w-full outline-none text-black text-sm bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Project */}
          <div className="mt-6  p-6 rounded-xl">
            <h3 className="text-lg font-semibold">Project</h3>
            <p className="text-gray-500 text-sm mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="mt-4  bg-white rounded-lg">
              <div
                className="flex justify-between items-center p-3 border-b border-[#D9D9D9] cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <span className="font-medium">Project Guidelines</span>
                <MdExpandMore
                  className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                />
              </div>

              <ul
                className={`overflow-hidden transition-all duration-500 ${
                  open ? "max-h-40 p-4" : "max-h-0 p-0"
                } text-sm text-gray-600 space-y-2`}
              >
                <li>• The title should not exceed 10 words.</li>
                <li>• The project must address a real-world problem.</li>
                <li>• Project ideas from previous years cannot be reused.</li>
                <li>• Minimum Team size is 4 members and maximum is 6.</li>
              </ul>
            </div>

            {/* Deadline */}
            <div className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg w-fit text-sm">
              Next deadline in 3 days
            </div>

            {/* Cards */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Last Feedback</h4>
                <p className="text-xs text-gray-500">
                  Excellent work on the design system. The color palette is
                  consistent and accessible.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Important Notes</h4>
                <p className="text-xs text-gray-500">
                  Discussion will be held. Lorem ipsum
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Supervisors</h4>
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src="https://i.pravatar.cc/30"
                    className="rounded-full"
                  />
                  <span className="text-xs">Ahmed Hassan</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src="https://i.pravatar.cc/31"
                    className="rounded-full"
                  />
                  <span className="text-xs">Amr Fouad</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 bg-white p-4 rounded-xl h-fit">
          <h3 className="font-semibold mb-4">Recent Activity</h3>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <img
                  src={`https://i.pravatar.cc/4${i}`}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm">Rahma Tawfik</p>
                  <p className="text-xs text-gray-500">New Task assigned</p>
                </div>
                <span className="ml-auto text-xs text-gray-400">12:30 pm</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
