import axios from "../apiConnection";

class StandUsersBridgeApi {
  constructor() {
    this.axios = axios; // Store the axios instance in a class property
  }

  registerUser(userDto) {
    return this.axios.post("/User", userDto);
  }
}

export default new StandUsersBridgeApi();