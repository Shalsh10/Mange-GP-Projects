import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
export default function MilestoneTabs() {
  const [value, setValue] = useState(0);
  return (
    <Box className="w-full">
      <Tabs
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        TabIndicatorProps={{
          style: {
            backgroundColor: "#243B56",
            height: "2px",
          },
        }}
        sx={{    
          "& .MuiTab-root": {
            color: "#27272A",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 500,
          },
          "& .Mui-selected": {
            color: "#27272A",
            fontWeight: 600,
          },
        }}
      >
        <Tab label="Current Milestone: Frontend" />
        <Tab label="Final Report" />
      </Tabs>
    </Box>
  );
}
