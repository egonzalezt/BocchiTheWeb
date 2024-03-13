import axios from "../apiConnection";

class ClientApi {
  constructor() {
    this.axios = axios; // Store the axios instance in a class property
  }

  static getToken() {
    return localStorage.getItem('accessToken');
  }

  addClient(clientDto) {
    return this.axios.post("/Client", clientDto, {
      headers: { Authorization: `Bearer ${ClientApi.getToken()}` },
    });
  }

  getClientById(id) {
    return this.axios.get(`/Client/${id}`, {
      headers: { Authorization: `Bearer ${ClientApi.getToken()}` },
    });
  }

  updateClient(id, updatedClient) {
    return this.axios.put(`/Client/${id}`, updatedClient, {
      headers: { Authorization: `Bearer ${ClientApi.getToken()}` },
    });
  }

  deleteClient(id) {
    return this.axios.delete(`/Client/${id}`, {
      headers: { Authorization: `Bearer ${ClientApi.getToken()}` },
    });
  }

  getClientsWithPagination(page, pageSize) {
    return this.axios.get(`/Client?page=${page}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${ClientApi.getToken()}` },
    });
  }

  checkEmailExistence(email) {
    return this.axios.get(`/Client/check-email?email=${email}`);
  }
}

export default new ClientApi();
