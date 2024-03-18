import axios from "../apiConnection";

class KeroAuthApi {
  constructor() {
    this.axios = axios;
  }

  login(userLoginDto) {
    return this.axios.post("/auth/login", userLoginDto);
  }

  requestPasswordReset(userLoginDto) {
    return this.axios.post("/auth/change-password", userLoginDto);
  }

  validateToken() {
    return this.axios.get(`/auth/validate-token`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    });
  }
}

export default new KeroAuthApi();