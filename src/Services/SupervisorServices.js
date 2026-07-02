import { customFetch } from '../apis/apiMain';

const submitRequestAsync = async (endpoint, method = 'GET', data = null) => {
  const options = { method };
  if (data) {
    options.body = data instanceof FormData ? data : JSON.stringify(data);
  }
  return customFetch(endpoint, options);
};

export const SupervisorService = {
  // --- Announcement ---
  sendAnnouncement: (data) => submitRequestAsync('supervisor/announcements', 'POST', data),
  getMyAnnouncements: () => submitRequestAsync('supervisor/announcements/my', 'GET'),
  getTeamList: () => submitRequestAsync('supervisor/teams', 'GET'),

  // --- Milestone Committees & Teams ---
  getAllMilestoneTeams: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    if (params.department_id) query.append("department_id", params.department_id);
    if (params.status) query.append("status", params.status);
    if (params.project_course_id) query.append("project_course_id", params.project_course_id);
    const queryString = query.toString() ? `?${query.toString()}` : "";
    return submitRequestAsync(`supervisor/milestone-committee/teams${queryString}`, "GET");
  },
  viewTeam: (teamId) => submitRequestAsync(`supervisor/milestone-committee/teams/${teamId}`, 'GET'),
  giveFeedbackOnFile: (fileId, data) => submitRequestAsync(`supervisor/milestone-committee/submission-files/${fileId}/feedback`, 'POST', data),
  getAllowableMilestones: (teamId) => submitRequestAsync(`doctor/committee/teams/${teamId}/available-milestones`, 'GET'),
  addGradeOnMilestone: (data) => submitRequestAsync('doctor/milestone-committees/grades', 'POST', data),
  getSupervisedTeams: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    if (params.department_id) query.append("department_id", params.department_id);
    if (params.status) query.append("status", params.status);
    if (params.counterpart_id) query.append("counterpart_id", params.counterpart_id);
    const queryString = query.toString() ? `?${query.toString()}` : "";
    return submitRequestAsync(`supervisor/team-management${queryString}`, "GET");
  },
  viewSupervisedTeam: (teamId) => submitRequestAsync(`supervisor/teams/${teamId}`, "GET"),
  getSupervisedTeamsList: () => submitRequestAsync("supervisor/teams_list", "GET"),
  gradeTeam: (data) => submitRequestAsync("doctor/team/grade", "POST", data),

  // --- Milestone Management ---
  getMilestonesWithTabs: () => submitRequestAsync('supervisor/milestones/tabs', 'GET'),
  getTeamsInMilestone: (milestoneId) => submitRequestAsync(`supervisor/milestones/${milestoneId}/teams`, 'GET'),
  addNoteOnMilestone: (milestoneId, data) => submitRequestAsync(`doctor/milestone-committees/${milestoneId}/notes`, 'POST', data),

  // --- Meetings ---
  getMeetingTeamsList: () => submitRequestAsync('supervisor/meetings/teams', 'GET'),
  getComingMeetings: () => submitRequestAsync('supervisor/meetings', 'GET'),
  scheduleMeeting: (data) => {
    const teamId = data.team_id || data.teamId || "";
    
    // Skip API if teamId is mock string (e.g. A, B, t1)
    if (typeof teamId === "string" && isNaN(parseInt(teamId))) {
      return Promise.reject(new Error("Mock team meeting schedule"));
    }

    const formData = new FormData();
    formData.append("team_id", teamId);
    
    let scheduledAt = data.scheduled_at || data.scheduledAt;
    if (!scheduledAt && data.date) {
      let cleanTime = data.time || "10:00:00";
      const match = cleanTime.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
      if (match) {
        let hrs = parseInt(match[1]);
        const mins = match[2];
        const ampm = match[3].toUpperCase();
        if (ampm === "PM" && hrs < 12) hrs += 12;
        if (ampm === "AM" && hrs === 12) hrs = 0;
        cleanTime = `${String(hrs).padStart(2, '0')}:${mins}:00`;
      }
      scheduledAt = `${data.date} ${cleanTime}`;
    }
    formData.append("scheduled_at", scheduledAt || "");
    formData.append("meeting_link", data.meeting_link || data.meetingLink || data.link || "");
    formData.append("title", data.title || data.meeting_name || data.meetingName || "Meeting");

    return submitRequestAsync('supervisor/meetings', 'POST', formData);
  },
  updateMeeting: (meetingId, data) => {
    const payload = {};
    if (data.scheduled_at || data.scheduledAt) {
      payload.scheduled_at = data.scheduled_at || data.scheduledAt;
    }
    if (data.meeting_link || data.meetingLink || data.link) {
      payload.meeting_link = data.meeting_link || data.meetingLink || data.link;
    }
    return submitRequestAsync(`supervisor/meetings/${meetingId}`, 'PUT', payload);
  },
  deleteMeeting: (meetingId) => submitRequestAsync(`supervisor/meetings/${meetingId}/delete`, 'DELETE'),

  // --- Defense Committees ---
  getMyDefenseCommittees: () => submitRequestAsync('supervisor/defense-committees/my', 'GET'),
  showDefenseCommittee: (id) => submitRequestAsync(`supervisor/defense-committees/${id}`, 'GET'),
  addDefenseGrade: (data) => submitRequestAsync('supervisor/defense-committees/grade', 'POST', data),
  exportMyDefenseCommittees: () => submitRequestAsync('supervisor/defense-committees/export', 'GET'),

  // --- Dashboard ---
  getDashboard: () => submitRequestAsync('supervisor/dashboard', 'GET'),
};