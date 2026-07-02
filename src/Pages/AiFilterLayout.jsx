import TeamSelector from "../Components/TeamSelector";
import MilestoneTabs from "../Components/MilestoneTabs";
import { Outlet } from "react-router-dom";
import Card from "../Components/Card";
import { Typography } from "@mui/material";
import Tasks from "../Components/Tasks.jsx";
export default function AiFilterLayout() {
  return (
    <div className="flex flex-col gap-6 w-full ">
      <div className="flex  w-full  justify-between">
        <div className="flex flex-col  justify-between basis-2/3">
          <MilestoneTabs />
          <Tasks />
          <Outlet />
        </div>
        <div className="flex flex-col justify-between">
          <TeamSelector />
          <Card
            title="Overall Similarity"
            value={71}
            color="#EF4444"
            onApprove={() => console.log("Approved")}
            onReject={() => console.log("Rejected")}
          >
            <Typography>
              Status: <b>High Risk</b>
            </Typography>
            <ul className="text-sm text-gray-600">
              <li>UI Elements & Layout: 65%</li>
              <li>User Flow & Logic: 20%</li>
              <li>Style & Assets: 15%</li>
            </ul>
            <Typography fontWeight={600}>AI Insights</Typography>
            <Typography variant="body2">
              Visual duplication detected. Recommend VIVA.
            </Typography>
          </Card>
        </div>
      </div>
    </div>
  );
}
