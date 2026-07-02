import { useState } from "react";
import { Box, MenuItem, Select, IconButton, Tabs, Tab } from "@mui/material";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
export default function TeamSelector() {
  const teams = ["Team", "Team A", "Team B", "Team C"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };
  const handleNext = () => {
    if (currentIndex < teams.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const arrowStyle = {
    backgroundColor: "#F1F7FF",
    width: 36,
    height: 36,
    borderRadius: "50%",
    "&:hover": {
      backgroundColor: "#E3EDFF",
    },
    "&.Mui-disabled": {
      backgroundColor: "#F1F7FF", 
      opacity: 0.5,
    },
  };
  return (
    <Box className="flex items-center gap-2">
      <IconButton
        onClick={handlePrev}
        disabled={currentIndex === 0}
        sx={arrowStyle}
      >
        <RiArrowLeftSLine size={18} color="#27272A" />
      </IconButton>
      <Select
        size="small"
        value={teams[currentIndex]}
        sx={{
          backgroundColor: "#F1F7FF",
          minWidth: 120,
          height: 36,
          fontSize: "14px",
          color: "#27272A",
          borderRadius: "10px",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            paddingY: "6px",
          },
        }}
      >
        {teams.map((team, index) => (
          <MenuItem
            key={team}
            value={team}
            onClick={() => setCurrentIndex(index)}
          >
            {team}
          </MenuItem>
        ))}
      </Select>
      <IconButton
        onClick={handleNext}
        disabled={currentIndex === teams.length - 1}
        sx={arrowStyle}
      >
        <RiArrowRightSLine size={18} color="#27272A" />
      </IconButton>
    </Box>
  );
}
