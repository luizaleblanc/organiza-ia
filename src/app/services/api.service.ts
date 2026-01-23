import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private api = axios.create({
    baseURL:'http://localhost:3000', 
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
    } catch (error) {
      console.error("Erro ao falar com a IA no Service:", error);
      throw error;
    }
  }
}