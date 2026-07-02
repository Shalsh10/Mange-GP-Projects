import "./adminHeader.css";
import { useState, useEffect } from "react";
import Admin from "../services/Admin.model";
import {
  FaSearch,
  FaBell,
  FaGraduationCap,
  FaPen
} from "react-icons/fa";

import logo from "../assets/logo2.png";

const Header = () => {
const [academicYear, setAcademicYear] = useState("");
const [academicYears, setAcademicYears] = useState([]);
const [selectedYearId, setSelectedYearId] = useState("");
  const [showYearModal, setShowYearModal] = useState(false);

const loadAcademicYears = async () => {
  try {
    const response = await Admin.getAcademicYears();

    console.log("Academic Years =>", response);

    setAcademicYears(response);

    const activeYear = response.find(
      (year) => year.is_active === 1
    );

    if (activeYear) {
      setAcademicYear(activeYear.code);
      setSelectedYearId(activeYear.id);
    }
  } catch (error) {
    console.error(error);
  }
};
useEffect(() => {
  const fetchData = async () => {
    await loadAcademicYears();
  };

  fetchData();
}, []);


const handleSave = () => {
  const selectedYear = academicYears.find(
    (year) => year.id === Number(selectedYearId)
  );

  if (selectedYear) {
    setAcademicYear(selectedYear.code);
  }

  setShowYearModal(false);
};
  return (
    <>
      <header className="header">
        <div className="headerr-left">
          <img
            src={logo}
            alt="logo"
            className="header-logo"
          />

          <div className="search-boxx">
            <FaSearch />

            <input
              placeholder="Search Projects or Students"
            />
          </div>
        </div>

        <div className="header-right">
          <div className="academic-year">
            <FaGraduationCap className="grad-icon" />

            <span>
              Academic Year : {academicYear}
            </span>

            <button
              className="edit-year-btn"
              onClick={() => setShowYearModal(true)}
            >
              <FaPen />
            </button>
          </div>

          <FaBell className="bell" />

          <div className="profile">
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
            />

            <span>Mahmoud Fareed</span>
          </div>
        </div>
      </header>

      {showYearModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowYearModal(false)}
        >
          <div
            className="year-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Edit Academic Year</h3>

              <button
                className="close-btn"
                onClick={() => setShowYearModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <label>Start Year</label>
<select
  value={selectedYearId}
  onChange={(e) =>
    setSelectedYearId(e.target.value)
  }
>
  {academicYears.map((year) => (
    <option
      key={year.id}
      value={year.id}
    >
      {year.code}
    </option>
  ))}
</select>

<p className="year-note">
  Selected Academic Year :
  <strong>
    {
      academicYears.find(
        (year) => year.id === Number(selectedYearId)
      )?.code
    }
  </strong>
</p>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowYearModal(false)}
              >
                Cancel
              </button>

              <button
                className="save-btn"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;