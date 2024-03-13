import axios from "../apiConnection";

class AuthApi {
  constructor() {
    this.axios = axios; // Store the axios instance in a class property
  }

  registerUser(userDto) {
    return this.axios.post("/auth/register", userDto);
  }

  login(userLoginDto) {
    return this.axios.post("/auth/login", userLoginDto);
  }

  refreshAccessToken(refreshTokenDto) {
    return this.axios.post("/auth/refresh", refreshTokenDto);
  }

  checkEmailExistence(email) {
    return this.axios.get(`/auth/check-email?email=${email}`);
  }
}

export default new AuthApi();