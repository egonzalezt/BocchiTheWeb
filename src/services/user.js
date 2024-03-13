import axios from "../apiConnection";

class UserApi {
  constructor() {
    this.axios = axios; // Store the axios instance in a class property
  }

  static getToken() {
    return localStorage.getItem('accessToken');
  }

  getUserById(id) {
    return this.axios.get(`/User/${id}`, {
      headers: { Authorization: `Bearer ${UserApi.getToken()}` },
    });
  }

  getUser() {
    return this.axios.get(`/User`, {
      headers: { Authorization: `Bearer ${UserApi.getToken()}` },
    });
  }
}

export default new UserApi();
