import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff, Mail, Lock } from 'lucide-angular';
import { AuthLayoutComponent } from '../components/auth-layout/auth-layout.component';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LucideAngularModule,
    AuthLayoutComponent,
  ],
  template: `
    <app-auth-layout>
      <form (submit)="login()" class="space-y-5">
        <div
          *ngIf="errorMessage"
          class="bg-red-500/10 border border-red-500/50 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 animate-fade-in text-sm font-medium"
        >
          <svg
            class="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          {{ errorMessage }}
        </div>

        <div class="space-y-1">
          <label
            class="text-xs font-bold text-[#243a5f] ml-1 uppercase tracking-wider"
          >
            E-mail ou Usuário
          </label>
          <div class="relative flex items-center">
            <lucide-icon
              [img]="icons.Mail"
              class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"
              [size]="18"
            ></lucide-icon>
            <input
              [(ngModel)]="email"
              name="email"
              type="text"
              class="w-full pl-14 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f]"
              [ngClass]="{ 'border-red-500': errorMessage && !email }"
              placeholder="seu@email.com ou @usuario"
              required
            />
          </div>
        </div>

        <div class="space-y-1">
          <label
            class="text-xs font-bold text-[#243a5f] ml-1 uppercase tracking-wider"
          >
            Senha
          </label>
          <div class="relative flex items-center">
            <lucide-icon
              [img]="icons.Lock"
              class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"
              [size]="18"
            ></lucide-icon>
            <input
              [(ngModel)]="password"
              name="password"
              [type]="showPassword ? 'text' : 'password'"
              class="w-full pl-14 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f]"
              [ngClass]="{ 'border-red-500': errorMessage && !password }"
              placeholder="••••••"
              required
            />
            <button
              type="button"
              (click)="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#243a5f] focus:outline-none transition-colors z-10"
            >
              <lucide-icon
                [img]="showPassword ? icons.EyeOff : icons.Eye"
                [size]="18"
              ></lucide-icon>
            </button>
          </div>
        </div>

        <button
          type="submit"
          [disabled]="isSubmitting"
          class="w-full bg-[#243a5f] hover:bg-[#1a2a4a] text-white font-bold py-3.5 rounded-full transition transform active:scale-[0.99] text-sm uppercase tracking-widest shadow-md mt-2 disabled:opacity-75 disabled:cursor-wait"
        >
          {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
        </button>

        <div class="text-center mt-8 pt-4 border-t border-slate-100">
          <p class="text-slate-500 text-sm mb-3">Não tem uma conta?</p>
          <a
            routerLink="/register"
            class="text-[#243a5f] font-bold text-base hover:underline uppercase"
          >
            INSCREVER-SE
          </a>
        </div>
      </form>
    </app-auth-layout>
  `,
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  showPassword = false;
  isSubmitting = false;
  errorMessage: string | null = null;

  readonly icons = { Eye, EyeOff, Mail, Lock };

  private router = inject(Router);
  private apiService = inject(ApiService);

  ngOnInit() {
    document.documentElement.classList.remove('dark');
  }

  async login() {
    this.errorMessage = null;

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos!';
      return;
    }

    this.isSubmitting = true;

    try {
      const response = await this.apiService.login({
        username_or_email: this.email,
        password: this.password,
      });

      if (response && response.token) {
        localStorage.setItem('user_token', response.token);
      }

      if (response && response.user && response.user.username) {
        localStorage.setItem('user_name', response.user.username);
      }

      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK') {
        this.errorMessage = 'Erro de conexão: Servidor offline.';
      } else if (error.response && error.response.status === 401) {
        this.errorMessage = 'Usuário, e-mail ou senha incorretos.';
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.detail
      ) {
        const detail = error.response.data.detail;
        this.errorMessage = Array.isArray(detail) ? detail[0].msg : detail;
      } else {
        this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';
      }
    } finally {
      this.isSubmitting = false;
    }
  }
}
