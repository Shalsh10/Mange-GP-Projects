import "./NewRequestPage.css";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  IoArrowBack,
} from "react-icons/io5";

import {
  FiSearch,
} from "react-icons/fi";

import {
  HiOutlineAdjustmentsHorizontal,
} from "react-icons/hi2";

import Requests from "../Services/Requests.model";

import Student from "../Services/Student.model";

function NewRequestPage() {

  const navigate = useNavigate();

  /* ================= STATES ================= */

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [sendingId, setSendingId] =
    useState(null);

  const [sentRequests, setSentRequests] =
    useState({});

  /* ================= GET STUDENTS ================= */

  useEffect(() => {

    fetchStudents();

  }, []);

  const fetchStudents = async () => {

    try {

      const response =
        await Student.getAvailableStudents();

      console.log(response);

      setStudents(
        response?.data || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  /* ================= SEND REQUEST ================= */

  const handleSendRequest = async (
    studentId
  ) => {

    try {

      setSendingId(studentId);

      const data = {
        to_user_id: studentId,
        request_type: "team_form",
      };

      const response =
        await Requests.sendRequest(data);

      console.log(response);

      /* ================= SAVE STATUS ================= */

      setSentRequests((prev) => ({
        ...prev,

        [studentId]:
          response?.status ||
          response?.data?.status ||
          "pending",
      }));

    } catch (error) {

      console.log(error);

      alert("Failed To Send Request");

    } finally {

      setSendingId(null);

    }
  };

  /* ================= SEARCH FILTER ================= */

  const filteredStudents =
    students.filter((item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="new-requests-page">

      {/* ================= HEADER ================= */}

      <div className="new-header">

        <div className="header-left">

          <IoArrowBack
            className="back-icon"
            onClick={() => navigate(-1)}
          />

          <h2>New Requests</h2>

        </div>

      </div>

      {/* ================= CARD ================= */}

      <div className="new-card">

        {/* ================= SEARCH ================= */}

        <div className="search-row">

          <div className="search-box">

            <FiSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <button className="filter-btn">

            <HiOutlineAdjustmentsHorizontal />

          </button>

        </div>

        {/* ================= USERS ================= */}

        <div className="users-list">

          {loading ? (

            <p className="loading-text">
              Loading...
            </p>

          ) : filteredStudents.length > 0 ? (

            filteredStudents.map((item) => (

              <div
                className="user-item"
                key={item.id}
              >

                {/* ================= USER INFO ================= */}

                <div className="user-info">

                  <img
                    src={
                      item.profile_image ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt={item.name}
                  />

                  <div>

                    <h4>
                      {item.name}
                    </h4>

                    <p>
                      {item.track}
                    </p>

                  </div>

                </div>

                {/* ================= ACTION BUTTON ================= */}

                <div className="user-actions">

                  {sentRequests[item.id] ===
                  "pending" ? (

                    <button className="pending-btn">
                      Pending
                    </button>

                  ) : (

                    <button
                      className="send-btn"
                      disabled={
                        !item.can_request ||
                        sendingId === item.id
                      }
                      onClick={() =>
                        handleSendRequest(
                          item.id
                        )
                      }
                    >

                      {sendingId === item.id
                        ? "Sending..."
                        : "Send"}

                    </button>

                  )}

                </div>

              </div>
            ))

          ) : (

            <div className="empty-state">

              No Available Students

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default NewRequestPage;