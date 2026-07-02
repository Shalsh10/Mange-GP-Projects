import "./RequestsPage.css";

import {
  useEffect,
  useState,
} from "react";

import {
  IoArrowBack,
} from "react-icons/io5";

import {
  FiSearch,
} from "react-icons/fi";

import {
  HiOutlineAdjustmentsHorizontal,
} from "react-icons/hi2";

import {
  useNavigate,
} from "react-router-dom";

import Requests from "../Services/Requests.model";

function RequestsPage() {

  const navigate = useNavigate();

  const activeTab = "received";

  /* ================= STATES ================= */

  const [requestsData, setRequestsData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(null);

  /* ================= GET REQUESTS ================= */

  useEffect(() => {

    getReceivedRequests();

  }, []);

  const getReceivedRequests = async () => {

    try {

      setLoading(true);

      const response =
        await Requests.getReceivedRequests();

      console.log(response);

      setRequestsData(
        response?.data || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  /* ================= ACCEPT / REJECT ================= */

  const handleRespond = async (
    requestId,
    status
  ) => {

    try {

      setActionLoading(requestId);

      const response =
        await Requests.requestRespond(
          requestId,
          status
        );

      console.log(response);

      /* ================= UPDATE UI ================= */

      setRequestsData((prev) =>
        prev.map((item) =>

          item.id === requestId

            ? {
                ...item,
                status: status,
              }

            : item
        )
      );

    } catch (error) {

      console.log(error);

      alert("Something Went Wrong");

    } finally {

      setActionLoading(null);

    }
  };

  /* ================= FILTER ================= */

  const filteredRequests =
    requestsData.filter((item) =>
      item.from_user.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="requests-page">

      {/* ================= HEADER ================= */}

      <div className="requests-header">

        <div className="header-left">

          <IoArrowBack
            className="back-icon"
            onClick={() => navigate(-1)}
          />

          <h2>Requests</h2>

        </div>

        <button
          className="new-request-btn"
          onClick={() =>
            navigate("/new-request")
          }
        >
          Send New Requests
        </button>

      </div>

      {/* ================= TABS ================= */}

      <div className="tabs-container">

        <button
          className={
            activeTab === "received"
              ? "tab active-tab"
              : "tab"
          }
          onClick={() =>
            navigate("/received")
          }
        >
          Received
        </button>

        <button
          className={
            activeTab === "sent"
              ? "tab active-tab"
              : "tab"
          }
          onClick={() =>
            navigate("/sent-requests")
          }
        >
          Sent
        </button>

      </div>

      {/* ================= CARD ================= */}

      <div className="requests-card">

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

        {/* ================= REQUESTS ================= */}

        <div className="requests-list">

          {loading ? (

            <p className="loading-text">
              Loading...
            </p>

          ) : filteredRequests.length === 0 ? (

            <p className="empty-text">
              No Requests Found
            </p>

          ) : (

            filteredRequests.map((item) => (

              <div
                className="request-item"
                key={item.id}
              >

                {/* ================= USER ================= */}

                <div className="request-user">

                  <img
                    src={
                      item.from_user
                        .profile_image ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt={
                      item.from_user.name
                    }
                  />

                  <div>

                    <h4>
                      {
                        item.from_user
                          .name
                      }
                    </h4>

                    <p>
                      {
                        item.from_user
                          .track
                      }
                    </p>

                  </div>

                </div>

                {/* ================= ACTIONS ================= */}

                <div className="request-actions">

                  {item.status ===
                  "accepted" ? (

                    <button className="accepted-btn">
                      Accepted
                    </button>

                  ) : item.status ===
                    "rejected" ? (

                    <button className="rejected-btn">
                      Rejected
                    </button>

                  ) : (

                    <>

                      <button
                        className="accept-btn"
                        disabled={
                          actionLoading ===
                          item.id
                        }
                        onClick={() =>
                          handleRespond(
                            item.id,
                            "accepted"
                          )
                        }
                      >
                        {
                          actionLoading ===
                          item.id
                            ? "Loading..."
                            : "Accept"
                        }
                      </button>

                      <button
                        className="reject-btn"
                        disabled={
                          actionLoading ===
                          item.id
                        }
                        onClick={() =>
                          handleRespond(
                            item.id,
                            "rejected"
                          )
                        }
                      >
                        Reject
                      </button>

                    </>

                  )}

                </div>

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default RequestsPage;