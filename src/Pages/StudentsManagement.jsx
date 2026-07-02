import Header from "../components/adminHeader";
import Sidebar from "../components/adminSidebar";
import "./StudentsManagement.css";
import {
  FaSearch,
  FaPlus,
  FaUpload,
  FaShareAlt
} from "react-icons/fa";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import Admin from "../services/Admin.model";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
const StudentsManagement = () => {
    const [excelFile, setExcelFile] = useState(null);
const [showUploadModal, setShowUploadModal] = useState(false);
    const [students, setStudents] = useState([]);
const [loading, setLoading] = useState(true);
const [type, setType] = useState("students");


const handleUploadExcel = async () => {
  try {
    const formData = new FormData();

    formData.append("file", excelFile);
    formData.append("course", 2);

    const response = await Admin.uploadStudent(formData);

    console.log("Upload Response:", response);

    loadData();

    setExcelFile(null);
    setShowUploadModal(false);

  } catch (error) {
    console.error(error);
  }
};

const loadData = async () => {
  try {
    setLoading(true);

    const response =
      type === "students"
        ? await Admin.showStudents()
        : await Admin.showDoctor();

    console.log("Response =>", response);

    setStudents(response.data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  loadData();
}, [type]);
if (loading) {
  return (
    <>
      <Sidebar />
      <Header />
      <div className="page">
        Loading Students...
      </div>
    </>
  );
}
  return (
    
    <>
    
      <Sidebar />
      <Header />

      <div className="page">

   <h2>
  {type === "students"
    ? "Students Management"
    : "Doctors Management"}
</h2>
<div className="tabs">
  <button
    className={type === "students" ? "active" : ""}
    onClick={() => setType("students")}
  >
    Students
  </button>

  <button
    className={type === "doctors" ? "active" : ""}
    onClick={() => setType("doctors")}
  >
    Doctors
  </button>

  <button>Assistants</button>
</div>

        <div className="table-card">

<div className="top-bar">

  <div className="search-wrapper">
    <FaSearch className="search-icon" />
    <input
      type="text"
      placeholder="Search"
    />
  </div>

  <div className="top-actions">

    <button className="btn-primary">
      <FaPlus />
      Add Student
    </button>

<button
  className="btn-secondary"
  onClick={() =>
    document.getElementById("excelUpload").click()
  }
>
  <FaUpload />
  Upload Excel
</button>

    <button className="btn-secondary">
      <FaShareAlt />
      Share Project 1 List
    </button>

  </div>

</div>
<input
  type="file"
  id="excelUpload"
  accept=".xlsx,.xls"
  style={{ display: "none" }}
  onChange={(e) => {
    setExcelFile(e.target.files[0]);
    setShowUploadModal(true); // 👈 افتحي البوب اب أول ما يختار ملف
  }}
/>
          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>University Email</th>
                <th>Department</th>
                <th>Grades</th>
                <th>Action</th>
              </tr>
            </thead>

<tbody>
  {students.map((student) => (
    <tr key={student.id}>
      <td>{student.id}</td>

      <td>{student.full_name}</td>

      <td>{student.email}</td>

      <td>{student.department || "-"}</td>

      <td>{student.gpa || "-"}</td>

<td>
  <div className="action-buttons">

    <button className="edit-btn">
      <FaPen />
      Edit
    </button>

    {student.is_active ? (
      <div className="status active">
        <FaCheckCircle />
        <span>Active</span>
      </div>
    ) : (
      <div className="status inactive">
        <FaTimesCircle />
        <span>Deactivate</span>
      </div>
    )}

  </div>
</td>
    </tr>
  ))}
</tbody>

          </table>
{showUploadModal && (
  <div className="modal-overlay">
    <div className="year-modal">

      <div className="modal-header">
        <h3>Confirm Upload</h3>

        <button
          className="close-btn"
          onClick={() => setShowUploadModal(false)}
        >
          ×
        </button>
      </div>

      <div className="modal-body">
        <p>
          Are you sure you want to upload this Excel file?
        </p>

        {excelFile && (
          <p style={{ marginTop: "10px", fontWeight: "bold" }}>
            File: {excelFile.name}
          </p>
        )}
      </div>

      <div className="modal-footer">

        <button
          className="cancel-btn"
          onClick={() => setShowUploadModal(false)}
        >
          Cancel
        </button>

        <button
          className="save-btn"
          onClick={handleUploadExcel}
        >
          Confirm 
        </button>

      </div>

    </div>
  </div>
)}
        </div>

      </div>
    </>
  );
};

export default StudentsManagement;