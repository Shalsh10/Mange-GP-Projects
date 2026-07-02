import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
} from "@mui/material";

import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";

import Admin from "../services/Admin.model";
import Header from "../components/adminHeader";
import Sidebar from "../components/adminSidebar";
import "./AllDiscussion.css";
import { useNavigate } from "react-router-dom";

export default function AllMilestoneCommittees() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
const handleDownload = async () => {
  try {
    const response =
      await Admin.downloadMilestoneCommittees();

    const link = document.createElement("a");

    link.href = response.download_url;
    link.download = response.file_name;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  } catch (error) {
    console.log(error);
  }
};
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);

      const response =
        await Admin.getMilestoneCommittees();

      setRows(response || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: "project_title",
      headerName: "Project",
      flex: 2,
    },

    {
      field: "project_category",
      headerName: "Category",
      flex: 1.3,
    },

    {
      field: "doctor1",
      headerName: "Doctor 1",
      flex: 1.2,
      renderCell: (params) =>
        params.row.doctors?.[0]?.name || "-",
    },

    {
      field: "doctor2",
      headerName: "Doctor 2",
      flex: 1.2,
      renderCell: (params) =>
        params.row.doctors?.[1]?.name || "-",
    },

    {
      field: "doctor3",
      headerName: "Doctor 3",
      flex: 1.2,
      renderCell: (params) =>
        params.row.doctors?.[2]?.name || "-",
    },

    {
      field: "ta1",
      headerName: "TA 1",
      flex: 1.2,
      renderCell: (params) =>
        params.row.tas?.[0]?.name || "-",
    },

    {
      field: "ta2",
      headerName: "TA 2",
      flex: 1.2,
      renderCell: (params) =>
        params.row.tas?.[1]?.name || "-",
    },

    {
      field: "ta3",
      headerName: "TA 3",
      flex: 1.2,
      renderCell: (params) =>
        params.row.tas?.[2]?.name || "-",
    },

    {
      field: "created_at",
      headerName: "Created At",
      flex: 1.5,
      renderCell: (params) =>
        new Date(params.value).toLocaleDateString(),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      filterable: false,

      renderCell: (params) => (
        <IconButton
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();

            navigate(
              `/edit-milestone-committee/${params.row.id}`
            );
          }}
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="main-content">
        <Header />

        <Box className="discussion-page">
          <Box className="discussion-header">
            <Typography
              variant="h4"
              fontWeight={700}
            >
              All Milestone Committees
            </Typography>

<Button
  variant="contained"
  startIcon={<DownloadIcon />}
  onClick={handleDownload}
>
  Download
</Button>
          </Box>

          <Paper className="discussion-table">
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              pageSizeOptions={[10, 20, 50]}
              disableRowSelectionOnClick
              autoHeight
onRowClick={(params) => {
  navigate(
    `/all-milestone-committees-details/${params.row.team_id}`
  );
}}
            />
          </Paper>
        </Box>
      </div>
    </div>
  );
}