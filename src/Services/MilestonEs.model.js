import { submitRequestAsync } from "./ApiServices";

class Milestones {
  static getOpenMilestones() {
    return submitRequestAsync("milestones", "GET");
  }

  static giveFeedbackOnFile(fileId, feedback) {
    const formData = new FormData();
    formData.append("feedback", feedback);

    return submitRequestAsync(
      `supervisor/milestone-committee/submission-files/${fileId}/feedback`,
      "POST",
      formData
    );
  }

  // 1. GET milestones with tabs
  static getMilestonesWithTabs(viewAs = "supervisor", tab = "All") {
    let tabParam = tab.toLowerCase().replace(" ", "_");
    if (tabParam === "all") {
      return submitRequestAsync(`supervisor/milestones?view_as=${viewAs}`, "GET");
    }
    return submitRequestAsync(`supervisor/milestones?view_as=${viewAs}&tab=${tabParam}`, "GET");
  }

  // 2. GET Teams in Milestone
  static getTeamsInMilestone(milestoneId, viewAs = "supervisor", type = "") {
    let url = `supervisor/milestones/${milestoneId}/teams?view_as=${viewAs}`;
    if (type) {
      url += `&type=${type}`;
    }
    return submitRequestAsync(url, "GET");
  }

  // 3. POST Add note on milestone for student
  static addNoteOnMilestone(milestoneId, note) {
    const formData = new FormData();
    formData.append("note", note);

    return submitRequestAsync(
      `doctor/milestone-committees/${milestoneId}/notes`,
      "POST",
      formData
    );
  }

  // 4. POST grade team
  static gradeTeam(teamId, projectCourseId, grade) {
    const formData = new FormData();
    formData.append("team_id", teamId);
    formData.append("project_course_id", projectCourseId);
    formData.append("grade", grade);

    return submitRequestAsync(
      "doctor/team/grade",
      "POST",
      formData
    );
  }

  // 5. POST add grade on milestone (Committee)
  static addGradeOnMilestone(teamId, milestoneId, grade) {
    const formData = new FormData();
    formData.append("team_id", teamId);
    formData.append("milestone_id", milestoneId);
    formData.append("grade", grade);

    return submitRequestAsync(
      "doctor/milestone-committees/grades",
      "POST",
      formData
    );
  }
}

export default Milestones;