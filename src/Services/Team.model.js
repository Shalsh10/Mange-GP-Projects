import { submitRequestAsync } from "./ApiServices";
class Team {
  static getTeamMembers() {
    return submitRequestAsync(`my-team`, "GET");
  } 
    static leaveNote(data) {
    return submitRequestAsync(`my-team/note`, "POST", data);
  } 
  static leaveTeam() {
  return submitRequestAsync(`my-team/leave`, "POST");
}  
  static getAvailableTeam() {
  return submitRequestAsync(`available/teams`, "GET");
}  
}


export default Team;