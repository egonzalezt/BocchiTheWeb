import axios from "../apiConnection";

class BebopTransfer {
  constructor() {
    this.axios = axios;
  }

  async getOperators() {
    try {
      const response = await this.axios.get(`/Operator/List`);
      return response;
    } catch (error) {
      throw new Error("Error al obtener los operadores");
    }
  }

  async transfer(dataToSend) {
    try {
      const response = await this.axios.post(`/Transfer/transfer-user`, dataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      return response;
    } catch (error) {
      throw new Error("Error al obtener los operadores");
    }
  }
}

export default new BebopTransfer();
