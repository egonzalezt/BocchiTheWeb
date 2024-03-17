import axios from "../apiConnection";

class KeroAuthApi {
  constructor() {
    this.axios = axios; // Store the axios instance in a class property
  }

  login(userLoginDto) {
    return this.axios.post("/auth/login", userLoginDto);
  }

  validateToken() {
    return this.axios.get(`/auth/validate-token`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    });
  }
}

export default new KeroAuthApi();