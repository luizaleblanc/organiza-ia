import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.scss'],
})
export class ChatWidgetComponent {
  private apiService = inject(ApiService);
  @ViewChild('scrollAnchor') private scrollAnchor!: ElementRef;

  chatAberto: boolean = true;
  isDarkMode: boolean = true;
  carregando: boolean = false;
  boasVindasEnviada: boolean = false;

  novaMensagem: string = '';
  mensagens: { autor: 'usuario' | 'ia'; conteudo: string; horario: Date }[] =
    [];

  constructor() {
    this.enviarBoasVindas();
  }

  alternarChat() {
    this.chatAberto = !this.chatAberto;
    if (this.chatAberto && !this.boasVindasEnviada) {
      this.enviarBoasVindas();
    }
    this.scrollToBottom();
  }

  private enviarBoasVindas() {
    if (!this.boasVindasEnviada) {
      this.mensagens.push({
        autor: 'ia',
        conteudo:
          'Olá! Sou o Assistente Organiza-IA. 🤖 Como posso te ajudar hoje?',
        horario: new Date(),
      });
      this.boasVindasEnviada = true;
    }
  }

  alternarTema() {
    this.isDarkMode = !this.isDarkMode;
  }

  limparConversa() {
    if (confirm('Deseja apagar todo o histórico?')) {
      this.mensagens = [];
      this.boasVindasEnviada = false;
      this.enviarBoasVindas();
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.scrollAnchor) {
        this.scrollAnchor.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  async enviarMensagem() {
    if (this.novaMensagem.trim() && !this.carregando) {
      const textoParaEnviar = this.novaMensagem;

      this.mensagens.push({
        autor: 'usuario',
        conteudo: textoParaEnviar,
        horario: new Date(),
      });

      this.novaMensagem = '';
      this.scrollToBottom();
      this.carregando = true;

      try {
        const data = await this.apiService.enviarMensagemIA(textoParaEnviar);

        const conteudoIA =
          data && data.resposta
            ? data.resposta
            : 'Desculpe, recebi uma resposta vazia do servidor.';

        this.mensagens.push({
          autor: 'ia',
          conteudo: conteudoIA,
          horario: new Date(),
        });
      } catch (error) {
        console.error('Erro na comunicação com a API:', error);
        this.mensagens.push({
          autor: 'ia',
          conteudo:
            'Erro de conexão. Verifique se o servidor está rodando na porta 3000.',
          horario: new Date(),
        });
      } finally {
        this.carregando = false;
        this.scrollToBottom();
      }
    }
  }
}
