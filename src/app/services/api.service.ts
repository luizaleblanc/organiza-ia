import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class ApiService {
private api = axios.create({
  baseURL: 'http://127.0.0.1:3000', 
});

  constructor() { }

  async login(dados: any): Promise<any> { 
    try {
      const response = await this.api.post('/loginn', dados);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async register(dados: any) {
    try {
      const response = await this.api.post('/usuarios', dados);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async enviarMensagemIA(texto: string): Promise<any> {
  try {
    const response = await this.api.post('/ia/chat', { mensagem: texto });
    return response.data;
  } catch (error: any) {
    console.error("Status do Erro:", error.response?.status);
    console.error("Dados do Erro:", error.response?.data);
    throw error;
  }
}
}