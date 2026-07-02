import { createBrowserRouter, Navigate } from "react-router-dom";

import Layout from "../Pages/Layouts/StudentLayout";
import NoTeamRoute from "../Components/NoTeamRoute";
import ForgetPassword from "../Pages/ForgetPassword";
import VerifyOTP from "../Pages/VerifyOTP";
import ResetPassword from "../Pages/ResetPassword";

import Doctor from "../Pages/Doctor";
import EditDoctorProfile from "../Pages/EditDoctorProfile";
import DoctorDashboard from "../Pages/DoctorDashboard";
import Supervising from "../Pages/Supervising";

import Tasks from "../Components/Tasks";

import AiFilterLayout from "../Pages/AiFilterLayout";
import MilestoneDetails from "../pages/MilestoneDetails";
import ProjectsManagedTeams from "../Pages/ProjectsManagedTeams";

import ProjectDetails from "../Pages/ProjectDetails";

import FinalDiscussion from "../Pages/FinalDiscussion";
import PreviousProjectDetails from "../Pages/PreviuosProjectDetails";

import JoinRequests from "../Pages/JoinRequests";

import NotificationsPage from "../Pages/Notifications";
import NotificationsPanel from "../Components/NotificationsPanel";

import ProjectTypes from "../Pages/projectType";
import UploadProjectIdea from "../Pages/UploadProjectIdea";
import Login from "../Pages/auth/Login";
import EditStudentProfile from "../Pages/EditStudentProfile";
import ProtectedRoute from "../Components/ProtectedRoute";
import AllDiscussion from "../Pages/AllDiscussion";
import RequestsPageNotInTeam from "../Pages/RequestsPageNotInTeam";
import PoliciesPage from "../Pages/PoliciesPage";
import TimelinePage from "../Pages/TimelinePage";
import ReportProblem from "../Pages/ReporProblem";
import GuestHomePage from "../Pages/GuestHomePage";
import Home from "../Pages/Home";
import NewRequestPage from "../Pages/NewRequestPage";
import UserInfo from "../Pages/UserInfo";
import SentRequestsPage from "../Pages/SentRequestsPage";
import ProjectsPage from "../Pages/ProjectsLiberary";
import ReceivedRequests from "../Pages/ReceivedRequests";
import AllProjectsPage from "../Pages/AllProjectsPage";
import TeamPage from "../Pages/TeamPage";
import StudentsManagement from "../Pages/StudentsManagement";
import SuggestedProjects from "../Pages/SuggestedProjects";
import FinalDiscussionDetails from "../Pages/FinalDiscussionDetails";
import AllMilestoneCommittees from "../Pages/AllMilestoneCommittees";
import MilestoneCommittee from "../Pages/MilestoneCommittee";
import UpcomingMeetings from "../Pages/UpcomingMeetings";
import MilestoneDoctor from "../Pages/MilestoneDoctor";

export const router = createBrowserRouter([
  // ================= AUTH =================
  { path: "login", element: <Login /> },
  { path: "/discussion-details/:id", element: <FinalDiscussionDetails /> },
  { path: "/milestone-committee", element: <MilestoneCommittee /> },
  { path: "/all-milestone-committees", element: <AllMilestoneCommittees /> },
  {
    path: "/all-milestone-committees-details/:id",
    element: <FinalDiscussionDetails />,
  },
  { path: "/suggested-projects", element: <SuggestedProjects /> },
  { path: "/final-discussions", element: <FinalDiscussion /> },
  { path: "/all-discussions", element: <AllDiscussion /> },
  { path: "/StudentsManagement", element: <StudentsManagement /> },
  { path: "/join-requests", element: <JoinRequests /> },
  { path: "/library", element: <ProjectsPage /> },
  { path: "/project-details/:id", element: <PreviousProjectDetails /> },
  { path: "/doctor/edit-profile", element: <EditDoctorProfile /> },

  { path: "/forget-password", element: <ForgetPassword /> },
  { path: "/verify-otp", element: <VerifyOTP /> },
  { path: "/reset-password", element: <ResetPassword /> },

  // ================= DOCTOR =================
  {
    path: "/doctor",
    element: <Doctor />,
    children: [
      { index: true, element: <Tasks /> },
      { path: "dashboard", element: <DoctorDashboard /> },
      { path: "supervising", element: <Supervising /> },
      {
        path: "ai-filter",
        element: <AiFilterLayout />,
        children: [
          { index: true, element: <div></div> },
          { path: "milestones", element: <div>Milestone Content</div> },
          { path: "team", element: <div>Team Content</div> },
        ],
      },
      { path: "projects", element: <ProjectsManagedTeams /> },
      { path: "project-details", element: <ProjectDetails /> },
      { path: "upcoming-meetings", element: <UpcomingMeetings /> },
    ],
  },

  { path: "/milestones", element: <MilestoneDoctor /> },
  { path: "/doctor/milestones", element: <MilestoneDoctor /> },
  { path: "/doctor/MilestoneDoctor", element: <MilestoneDoctor /> },
  { path: "/doctor/join-requests", element: <JoinRequests /> },

  // ================= STUDENT LAYOUT =================
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "Upload-Project-Idea", element: <UploadProjectIdea /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "notifications-panel", element: <NotificationsPanel /> },
      { path: "project-types", element: <ProjectTypes /> },
      {
        path: "user",
        element: <UserInfo />,
        children: [
          { path: "profile", element: <EditStudentProfile /> },
          { path: "policies", element: <PoliciesPage /> },
          { path: "report-problem", element: <ReportProblem /> },
        ],
      },
      { path: "ProjectsLibrary", element: <ProjectsPage /> },
      { path: "projects/:type", element: <AllProjectsPage /> },
      { path: "team", element: <TeamPage /> },
      { path: "received", element: <ReceivedRequests /> },
      { path: "sent-requests", element: <SentRequestsPage /> },
      { path: "new-request", element: <NewRequestPage /> },
      { path: "guestHomePage", element: <GuestHomePage /> },
      { path: "timeline", element: <TimelinePage /> },
      { path: "milestones/:id", element: <MilestoneDetails /> },
      { path: "receivedNotInTeam", element: <RequestsPageNotInTeam /> },
    ],
  },
]);