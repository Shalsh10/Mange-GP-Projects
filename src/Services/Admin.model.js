import { submitRequestAsync } from "./ApiServices";

class Admin {

    static showStudents() {
  return submitRequestAsync(`admin/student`, "GET");
} 
    static getAcademicYears() {
  return submitRequestAsync(`academic-years`, "GET");
} 
    static uploadStudent(data) {
  return submitRequestAsync(`admin/student/import`, "POST", data);
} 
    static showDoctor() {
  return submitRequestAsync(`admin/doctor`, "GET");
} 
    static uploadDoctor(data) {
  return submitRequestAsync(`admin/doctor/import`, "POST", data);
} 
    static librarySuggested() {
  return submitRequestAsync(`library/suggested`, "GET");
} 
    static addsuggestedProject(data) {
  return submitRequestAsync(`admin/suggested_project/store`, "POST", data);
} 
    static getDiscissionProjects(id){
        return submitRequestAsync(`admin/defense-committees/projects?project_course_id=${id}`)
    }
        static getAvailableDoctorsAndTA(id) {
  return submitRequestAsync(`admin/defense-committees/options?team_id=${id}`, "GET");
} 
        static defenseCommittees(data) {
  return submitRequestAsync(`/admin/defense-committees`, "POST", data);
} 
        static getDefenseCommittees(id) {
  return submitRequestAsync(`/admin/defense-committees?project_course_id=${id}`, "GET");
} 
        static deleteDefenseCommittee(id) {
  return submitRequestAsync(`/admin/defense-committees/${id}`, "DELETE");
} 
        static updateDefenseCommittee(id, data) {
  return submitRequestAsync(`/admin/defense-committees/${id}`, "PUT", data);
} 
        static viewTeams(id) {
  return submitRequestAsync(`/admin/teams/view_team/${id}`, "GET");
} 
        static getMilestoneCommittees() {
  return submitRequestAsync(`/admin/milestone-committees`, "GET");
} 
        static downloadMilestoneCommittees() {
  return submitRequestAsync(`/admin/milestone-committees/export`, "GET");
} 
        static getEigibleTeams() {
  return submitRequestAsync(`admin/milestone-committees/eligible-teams`, "GET");
}
        static getFormData(id) {
  return submitRequestAsync(`admin/milestone-committees/${id}/form-data`, "GET");
}
}


export default Admin;