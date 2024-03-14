import axios from "../apiConnection";

class StandUsersApi {
  constructor() {
    this.axios = axios; // Store the axios instance in a class property
  }

  checkEmailExistence(email) {
    return this.axios.get(`/User/check-email?Value=${email}`);
  }

  checkIdentificationNumberExistence(email) {
    return this.axios.get(`/User/check-identification?identificationNumber=${email}`);
  }
}

export default new StandUsersApi();