import { customFetch } from "../apis/apiMain";

class Project {
  static uploadIdea(data) {
    return customFetch("proposal/submit", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static submitTask(data) {
    return customFetch("submission/upload", {
      method: "POST",
      body: data, // إذا كان FormData لا تستخدم JSON.stringify
    });
  }

  static reportProblem(data) {
    return customFetch("reports", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static getDepartments() {
    return customFetch("departments", { method: "GET" });
  }

  static getAcademicYears() {
    return customFetch("academic-years", { method: "GET" });
  }

  static getFormData() {
    return customFetch("proposal/form-data", { method: "GET" });
  }

  static getProjectTypes() {
    return customFetch("project-types", { method: "GET" });
  }

  static getSuggestedProjects() {
    return customFetch("library/suggested", { method: "GET" });
  }

  static getPreviousProjects() {
    return customFetch("library/previous", { method: "GET" });
  }

  static getProjectDetails(id) {
    return customFetch(`library/previous/${id}`, { method: "GET" });
  }

  static getMytimeline() {
    return customFetch("my-timeline", { method: "GET" });
  }

  static getMyMilestones(id) {
    return customFetch(`my-timeline/milestones/${id}`, { method: "GET" });
  }

  static getMyGuestMilestones() {
    return customFetch("milestones", { method: "GET" });
  }

  // Doctor project details by team id
  static getDoctorProjectDetails(teamId) {
    return customFetch(`supervisor/team-management/${teamId}`, {
      method: "GET",
    });
  }
}

export default Project;