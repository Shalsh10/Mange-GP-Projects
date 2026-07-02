import { Tabs, Tab, Box, Grid } from "@mui/material";
import { useState } from "react";
import ProjectCard from "../Components/joinCard";

const JoinTabs = ({ projects }) => {
  const [tab, setTab] = useState(0);

  const handleChange = (_, newValue) => {
    setTab(newValue);
  };

  const filteredProjects =
    tab === 0
      ? projects
      : projects.filter((p) => p.type === (tab === 1 ? "active" : "archived"));

  return (
    <Box>
      <Tabs value={tab} onChange={handleChange}>
        <Tab label="All" />
        <Tab label="Active" />
        <Tab label="Archived" />
      </Tabs>

<Box
        mt={2}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: 2,
        }}
      >
        {filteredProjects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </Box>
    </Box>
  );
};

export default JoinTabs;