import axios from "../apiConnection";

class CoplandFileManager {
  constructor() {
    this.axios = axios; // Almacena la instancia de axios en una propiedad de la clase
  }

  registerUser(userDto) {
    return this.axios.post("/User", userDto);
  }

  async uploadFileSignedUrl(dataToSend) {
    try {
      const response = await this.axios.post("/File/upload-file-signed-url", dataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error("Error al generar la URL firmada para subir el archivo");
    }
  }

  async uploadFile(url, mimeType, fileBinary) {
    try {
      const response = await this.axios.put(url, fileBinary, {
        headers: {
          "Content-Type": mimeType,
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error("Error al subir el archivo");
    }
  }  
}

export default new CoplandFileManager();
