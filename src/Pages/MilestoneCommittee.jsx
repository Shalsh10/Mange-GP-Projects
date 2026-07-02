

import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import Header from "../components/adminHeader";
import Sidebar from "../components/adminSidebar";
import Admin from "../services/Admin.model";
import { useNavigate } from "react-router-dom";
import "./MilestoneCommittee.css";

export default function MilestoneCommittee() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] =
    useState("");
const navigate = useNavigate();
  const [category, setCategory] =
    useState("");

  const [doctors, setDoctors] = useState([]);
  const [tas, setTas] = useState([]);

  const [formData, setFormData] =
    useState({
      doctor1: "",
      doctor2: "",
      doctor3: "",
      ta1: "",
      ta2: "",
      ta3: "",
    });

  useEffect(() => {
    getTeams();
  }, []);

  const getTeams = async () => {
    try {
      const res =
        await Admin.getEigibleTeams();

      setTeams(res || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTeamChange = async (
    event
  ) => {
    const teamId = event.target.value;

    setSelectedTeam(teamId);

    try {
      const res =
        await Admin.getFormData(teamId);

      setCategory(
        res.team.project_category
      );

      setDoctors(
        res.available_doctors || []
      );

      setTas(
        res.available_tas || []
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectChange = (
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log({
      team_id: selectedTeam,
      ...formData,
    });
  };

  return (
<div className="admin-layout">
  <Sidebar />

  <div className="main-content">
    <Header />

    <div className="milestone-page">
      <div className="milestone-card">

        <div className="page-header">
          <h2>Milestone Committee</h2>

<Button
  variant="contained"
  className="view-btn"
  onClick={() =>
    navigate("/all-milestone-committees")
  }
>
  View All Committees
</Button>
        </div>

        {/* Project Section */}

        <div className="project-section">
          <h3>Select Project</h3>

          <div className="project-row">
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>

              <Select
                value={selectedTeam}
                label="Project"
                onChange={handleTeamChange}
              >
                {teams.map((team) => (
                  <MenuItem
                    key={team.team_id}
                    value={team.team_id}
                  >
                    {team.project_title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="category-badge">
              {category || "Category"}
            </div>
          </div>
        </div>

        {/* Committee Section */}

        <div className="committee-section">
          <h3>Assign Supervising Committee</h3>

          <div className="committee-grid">

            {/* Doctors */}

            <Paper className="committee-box">
              <h4>Doctors</h4>

              {[1, 2, 3].map((index) => (
                <FormControl
                  fullWidth
                  key={index}
                  className="committee-select"
                >
                  <InputLabel>
                    Doctor {index}
                  </InputLabel>

                  <Select
                    label={`Doctor ${index}`}
                    value={
                      formData[`doctor${index}`]
                    }
                    onChange={(e) =>
                      handleSelectChange(
                        `doctor${index}`,
                        e.target.value
                      )
                    }
                  >
                    {doctors.map((doctor) => (
                      <MenuItem
                        key={doctor.id}
                        value={doctor.id}
                      >
                        {doctor.full_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
            </Paper>

            {/* Assistants */}

            <Paper className="committee-box">
              <h4>Assistants</h4>

              {[1, 2, 3].map((index) => (
                <FormControl
                  fullWidth
                  key={index}
                  className="committee-select"
                >
                  <InputLabel>
                    Assistant {index}
                  </InputLabel>

                  <Select
                    label={`Assistant ${index}`}
                    value={
                      formData[`ta${index}`]
                    }
                    onChange={(e) =>
                      handleSelectChange(
                        `ta${index}`,
                        e.target.value
                      )
                    }
                  >
                    {tas.map((ta) => (
                      <MenuItem
                        key={ta.id}
                        value={ta.id}
                      >
                        {ta.full_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
            </Paper>

          </div>

          <div className="submit-wrapper">
            <Button
              variant="contained"
              size="large"
              className="schedule-btn"
              onClick={handleSubmit}
            >
              Schedule Committee
            </Button>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>
  );
}
