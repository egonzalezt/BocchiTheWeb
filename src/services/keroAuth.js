import axios from "../apiConnection";

class KeroAuthApi {
  constructor() {
    this.axios = axios; // Store the axios instance in a class property
  }

  login(userLoginDto) {
    return this.axios.post("/auth/login", userLoginDto);
  }
}

export default new KeroAuthApi();