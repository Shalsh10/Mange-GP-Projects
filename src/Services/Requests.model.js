import { submitRequestAsync } from "./ApiServices";

class Requests {
  static getReceivedRequests() {
    return submitRequestAsync(`requests/received`, "GET");
  }

  static getDoctorRequests(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.team_size) params.append("team_size", filters.team_size);
    if (filters.department_id) params.append("department_id", filters.department_id);
    if (filters.categories && filters.categories.length > 0) {
      filters.categories.forEach(cat => {
        params.append("categories[]", cat);
      });
    }
    const queryString = params.toString();
    const url = `supervisor/requests${queryString ? `?${queryString}` : ""}`;
    return submitRequestAsync(url, "GET");
  }

  static getSentRequests() {
    return submitRequestAsync(`requests/sent`, "GET");
  }

  static sendRequest(data) {
    return submitRequestAsync(`requests`, "POST", data);
  }

  static requestRespond(id, status) {
    return submitRequestAsync(`supervisor/requests/${id}/respond`, "PUT", {
      status,
    });
  }

  static getReceivedRequestsFromTeams() {
    return submitRequestAsync(`requests/received?type=teams`, "GET");
  }

  static getReceivedRequestsFromStudents() {
    return submitRequestAsync(`requests/received?type=students`, "GET");
  }

  static getDepartments() {
    return submitRequestAsync("departments", "GET");
  }
}

export default Requests;