import "./MilestoneDetails.css";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  FaRegCalendarAlt,
  FaStar,
  FaFilePdf,
} from "react-icons/fa";

import { MdOutlineWatchLater } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";
import { BsCircle } from "react-icons/bs";

import Project from "../Services/Project.model";

function MilestoneDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [milestone, setMilestone] = useState(null);

  useEffect(() => {
    fetchMilestone();
  }, [id]);

  const fetchMilestone = async () => {
    try {
      setLoading(true);

      const response =
        await Project.getMyMilestones(id);

      setMilestone(
        response?.data || response
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="milestone-page">
        Loading...
      </div>
    );
  }

  if (!milestone) {
    return (
      <div className="milestone-page">
        No Data Found
      </div>
    );
  }

  const submission =
    milestone.submissions?.[0];

  const feedbackFiles =
    submission?.files?.filter(
      (file) => file.feedback
    ) || [];

  return (
    <div className="milestone-page">

      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        <IoArrowBackOutline />
      </button>

      {/* HEADER */}

{/* TOP SECTION */}

<div className="top-section">

  <div className="milestone-header-card">

    <h2>
      {milestone.title}
    </h2>

    <div className="milestone-row">

      <span className="label">
        Course :
      </span>

      <span>
        {
          milestone.project_course?.name
        }
      </span>

    </div>

    <div className="milestone-row description">

      <span className="label">
        Description :
      </span>

      <span>
        {milestone.description}
      </span>

    </div>

    <div className="dates">

      <div className="date-item">

        <FaRegCalendarAlt
          className="assigned-icon"
        />

        <span>
          Assigned Date :
        </span>

        <strong>
          {new Date(
            milestone.start_date
          ).toLocaleDateString()}
        </strong>

      </div>

      <div className="date-item">

        <MdOutlineWatchLater
          className="due-icon"
        />

        <span>
          Due Date :
        </span>

        <strong>
          {new Date(
            milestone.deadline
          ).toLocaleDateString()}
        </strong>

      </div>

    </div>

  </div>

  <div className="grade-card">

    <div className="grade-title">

      <FaStar />

      <h3>
        Grade
      </h3>

    </div>

    {milestone.earned_score ? (
      <>
        <p>
          <strong>
            Score :
          </strong>
          {" "}
          {milestone.earned_score}
          /
          {milestone.max_score}
        </p>

        {milestone.graded_at && (
          <p>
            <strong>
              Graded At :
            </strong>
            {" "}
            {milestone.graded_at}
          </p>
        )}

        {milestone.graded_by && (
          <p>
            <strong>
              Graded By :
            </strong>
            {" "}
            {
              milestone.graded_by?.name
            }
          </p>
        )}
      </>
    ) : (
      <p>
        Not graded yet
      </p>
    )}

  </div>

</div>

{/* REQUIREMENTS + SUBMISSION */}

<div className="middle-section">

  <div className="requirements-card">

    <h3>
      Requirements
    </h3>

    {milestone.requirements?.map(
      (item, index) => (

        <div
          key={index}
          className="requirement-item"
        >

          <BsCircle />

          <span>
            {item}
          </span>

        </div>
      )
    )}

  </div>

  {submission && (

    <div className="submission-card">

      <h3>
        Submission
      </h3>

      <div className="submission-info">

        <p>

          <strong>
            Submitted By:
          </strong>

          {" "}
          {
            submission.submitted_by
              ?.name
          }

        </p>

        <p>

          <strong>
            Submitted At:
          </strong>

          {" "}
          {new Date(
            submission.submitted_at
          ).toLocaleDateString()}

        </p>

      </div>

      <p className="submission-note">

        {submission.notes}

      </p>

    </div>
  )}

</div>

{/* FILES */}

{submission?.files?.length > 0 && (

  <div className="files-card">

    <h3>
      Uploaded Files
    </h3>

    {submission.files.map(
      (file) => (

        <div
          key={file.id}
          className="file-item"
        >

          <div className="file-left">

            <FaFilePdf />

            <div>

              <div>
                {file.file_name}
              </div>

              <small>

                Uploaded:
                {" "}
                {new Date(
                  file.uploaded_at
                ).toLocaleDateString()}

              </small>

            </div>

          </div>

          <a
            href={file.file_url}
            target="_blank"
            rel="noreferrer"
          >
            View
          </a>

        </div>
      )
    )}

  </div>
)}

{/* FEEDBACK */}

{feedbackFiles.length > 0 && (

  <div className="feedback-section">

    <h3>
      Feedback
    </h3>

    {feedbackFiles.map(
      (file) => (

        <div
          key={file.id}
          className="feedback-box"
        >

          <div className="feedback-file">

            {file.file_name}

          </div>

          <p>

            {
              file.feedback.text
            }

          </p>

          <div className="feedback-footer">

            <span>

              Graded by
              {" "}
              {
                file.feedback.by
                  .name
              }

            </span>

            <span>

              {
                file.feedback.at
              }

            </span>

          </div>

        </div>
      )
    )}

  </div>
)}

    </div>
  );
}

export default MilestoneDetails;