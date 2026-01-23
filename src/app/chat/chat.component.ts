import { Component } from '@angular/core';
import { ApiService } from '../services/api.service'; 

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  textoDigitado: string = '';

  mensagens: any[] = [];

  constructor(private apiService: ApiService) {}

  async enviarMensagem() {
    if (!this.textoDigitado.trim()) return;

    const pergunta = this.textoDigitado;
    this.mensagens.push({ autor: 'Você', conteudo: pergunta });
    this.textoDigitado = ''; 
    try {
      const resposta = await this.apiService.enviarMensagemIA(pergunta);

      this.mensagens.push({ autor: 'IA', conteudo: resposta.mensagem });

    } catch (error) {
      console.error("Erro na comunicação:", error);
      this.mensagens.push({ autor: 'Sistema', conteudo: 'Erro ao conectar com a IA.' });
    }
  }
}