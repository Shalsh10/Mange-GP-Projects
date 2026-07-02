import { submitRequestAsync } from "./ApiServices";

class Auth {
      static Login(credentials) {
    return submitRequestAsync("login", "POST", credentials);
  }

  static updateProfile(data) {
    return submitRequestAsync("profile", "POST", data);
  }

    static getHome() {
  return submitRequestAsync(`home`, "GET");
} 

}



export default Auth;