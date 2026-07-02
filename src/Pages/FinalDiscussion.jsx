import "./FinalDiscussion.css";
import { useEffect ,useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import Header from "../components/adminHeader";
import Sidebar from "../components/adminSidebar";

import {
  Box,
  Paper,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
  Chip,
  TextField,
} from "@mui/material";

import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import Admin from "../services/Admin.model";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { MdOutlineLocationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";
export default function FinalDiscussion() {

const [capstoneId, setCapstoneId] = useState(1); // Capstone 1 افتراضي
const navigate = useNavigate();
const [projects, setProjects] = useState([]);
const [selectedDoctors, setSelectedDoctors] = useState(["", "", ""]);
const [selectedTas, setSelectedTas] = useState(["", "", ""]);
const [project, setProject] = useState("");
const [location, setLocation] = useState("");
const [selectedProjectData, setSelectedProjectData] =
  useState(null);
  const [date, setDate] = useState(dayjs("2026-05-25"));
const [doctors, setDoctors] = useState([]);
const [tas, setTas] = useState([]);
  const [time, setTime] = useState(
    dayjs().hour(10).minute(0)
  );

const fetchCommitteeOptions = async (teamId) => {
  try {
    const res = await Admin.getAvailableDoctorsAndTA(teamId);

    const data = res;

    const doctorsList = data?.doctors || [];
    const tasList = data?.tas || [];

    setDoctors(doctorsList);
    setTas(tasList);

    setSelectedDoctors([
      doctorsList[0]?.id || "",
      doctorsList[1]?.id || "",
      doctorsList[2]?.id || "",
    ]);

    setSelectedTas([
      tasList[0]?.id || "",
      tasList[1]?.id || "",
      tasList[2]?.id || "",
    ]);

  } catch (error) {
    console.error(error);
  }
};
const handleScheduleDiscussion = async () => {
  try {
    const scheduledAt = dayjs(date)
      .hour(dayjs(time).hour())
      .minute(dayjs(time).minute())
      .second(0)
      .format("YYYY-MM-DD HH:mm:ss");

    const data = {
      team_id: project,
      project_course_id: capstoneId,
      scheduled_at: scheduledAt,
      location,
      doctor_ids: selectedDoctors,
      ta_ids: selectedTas,
    };

    const res = await Admin.defenseCommittees(data);

    toast.success(
      res?.message || "Discussion scheduled successfully"
    );

    console.log(res);
  } catch (error) {
    console.error(error);

    const validationErrors =
      error?.response?.data?.errors;

    if (validationErrors) {
      const firstError =
        Object.values(validationErrors)[0]?.[0];

      toast.error(firstError);
    } else {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    }
  }
};
const fetchProjects = async (id) => {
  try {
    const res = await Admin.getDiscissionProjects(id);

    console.log("Projects Response =>", res);

    const projectList = res || [];

    setProjects(projectList);

    if (projectList.length > 0) {
      const first = projectList[0];

      setProject(first.team_id);
      setSelectedProjectData(first);

      fetchCommitteeOptions(first.team_id);
    }
  } catch (error) {
    console.error("fetchProjects error:", error);
  }
};
useEffect(() => {
  fetchProjects(capstoneId);
}, [capstoneId]);
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="main-content">
        <Header />

        <div className="discussion-container">

          {/* Tabs */}

<div className="capstone-tabs">
  <button
    className={`capstone-btn ${
      capstoneId === 1 ? "active" : ""
    }`}
    onClick={() => setCapstoneId(1)}
  >
    Capstone 1
  </button>

  <button
    className={`capstone-btn ${
      capstoneId === 2 ? "active" : ""
    }`}
    onClick={() => setCapstoneId(2)}
  >
    Capstone 2
  </button>
</div>
          {/* Header */}

          <div className="page-top">
            <Typography
              variant="h4"
              fontWeight={700}
            >
              Final Discussion Commitee
            </Typography>

<Button
  variant="contained"
  className="view-discussions-btn"
  onClick={() =>
    navigate(
      `/all-discussions?capstoneId=${capstoneId}`
    )
  }
>
  View Final Discussions
</Button>
          </div>

          {/* Project */}

          <Paper className="custom-card">
            <Typography className="section-title">
              Select Project
            </Typography>

            <div className="project-row">
<FormControl
  sx={{ width: 350 }}
  size="small"
>
<Select
  value={project || ""}
  onChange={(e) => {
    const teamId = e.target.value;

    setProject(teamId);

    const selected = projects.find(
      (p) => p.team_id === teamId
    );

    setSelectedProjectData(selected);

    fetchCommitteeOptions(teamId);
  }}
>
    {projects.map((item) => (
      <MenuItem
        key={item.team_id}
        value={item.team_id}
      >
        {item.project_title}
      </MenuItem>
    ))}
  </Select>
</FormControl>

              <div className="category-box">
                <Typography>
                  Category
                </Typography>

<Chip
  label={
    selectedProjectData?.project_category ||
    "-"
  }
  size="small"
  className="category-chip"
/>
              </div>
            </div>
          </Paper>

          {/* Committee Details */}

          <Paper className="custom-card">
            <Typography className="section-title">
              Commitee Details
            </Typography>

            <LocalizationProvider
              dateAdapter={AdapterDayjs}
            >
              <div className="committee-details">

                <DatePicker
                  value={date}
                  onChange={setDate}
                  slotProps={{
                    textField: {
                      size: "small",
                    },
                  }}
                />

                <TimePicker
                  value={time}
                  onChange={setTime}
                  slotProps={{
                    textField: {
                      size: "small",
                    },
                  }}
                />

  <TextField
  size="small"
  placeholder="Enter Location"
  value={location}
  onChange={(e) => setLocation(e.target.value)}
  InputProps={{
    startAdornment: <MdOutlineLocationOn />,
  }}
/>
              </div>
            </LocalizationProvider>
          </Paper>

          {/* Assign */}

          <Paper className="custom-card">
            <Typography className="section-title">
              Assign Final Discussion Commitee
            </Typography>

            <div className="committee-grid">

              <div>
                <Typography className="column-title">
                  Doctors
                </Typography>
{[1, 2, 3].map((item, index) => (
  <FormControl key={item} fullWidth size="small" sx={{ mb: 2 }}>
    <Select
      value={selectedDoctors[index]}
      onChange={(e) => {
        const updated = [...selectedDoctors];
        updated[index] = e.target.value;
        setSelectedDoctors(updated);
      }}
    >
      {doctors.map((doctor) => (
        <MenuItem key={doctor.id} value={doctor.id}>
          {doctor.full_name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
))}
              </div>

              <div>
                <Typography className="column-title">
                  Assistant
                </Typography>

{[1, 2, 3].map((item, index) => (
  <FormControl key={item} fullWidth size="small" sx={{ mb: 2 }}>
    <Select
      value={selectedTas[index]}
      onChange={(e) => {
        const updated = [...selectedTas];
        updated[index] = e.target.value;
        setSelectedTas(updated);
      }}
    >
      {tas.map((ta) => (
        <MenuItem key={ta.id} value={ta.id}>
          {ta.full_name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
))}
              </div>

            </div>
          </Paper>

          <Box className="submit-area">
<Button
  variant="contained"
  className="schedule-btn"
  onClick={handleScheduleDiscussion}
>
  Schedule Discussion
</Button>
          </Box>

        </div>
      </div>
    </div>
  );
}