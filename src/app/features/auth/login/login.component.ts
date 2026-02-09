import { Component, inject } from '@angular/core';
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
        <div class="space-y-1">
          <label class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider">
            E-mail ou Usuário
          </label>
          <div class="relative flex items-center">
            <lucide-icon 
              [img]="icons.Mail" 
              class="absolute left-4 text-slate-400 z-10" 
              [size]="18">
            </lucide-icon>
            
            <input
              [(ngModel)]="email"
              name="email"
              type="email"
              class="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white"
              placeholder="seu@email.com"
              required
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider">
            Senha
          </label>
          <div class="relative flex items-center">
            <lucide-icon 
              [img]="icons.Lock" 
              class="absolute left-4 text-slate-400 z-10" 
              [size]="18">
            </lucide-icon>

            <input
              [(ngModel)]="password"
              name="password"
              [type]="showPassword ? 'text' : 'password'"
              class="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white"
              placeholder="••••••"
              required
            />

            <button 
              type="button"
              (click)="showPassword = !showPassword"
              class="absolute right-4 p-1 text-slate-400 hover:text-[#243a5f] focus:outline-none transition-colors z-10"
            >
              <lucide-icon [img]="showPassword ? icons.EyeOff : icons.Eye" [size]="18"></lucide-icon>
            </button>
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-[#243a5f] hover:bg-[#1a2a4a] text-white font-bold py-3.5 rounded-full transition transform active:scale-[0.99] text-sm uppercase tracking-widest shadow-md mt-2"
        >
          Entrar
        </button>

        <div class="text-center mt-8 pt-4 border-t border-slate-100 dark:border-gray-700">
          <p class="text-slate-500 text-sm mb-3">Não tem uma conta?</p>
          <a routerLink="/register" class="text-[#243a5f] dark:text-blue-300 font-bold text-base hover:underline uppercase">
            INSCREVER-SE
          </a>
        </div>
      </form>
    </app-auth-layout>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false; 
  
  readonly icons = { Eye, EyeOff, Mail, Lock };

  private router = inject(Router);
  private apiService = inject(ApiService);

  async login() {
    if (this.email && this.password) {
      try {
        const response = await this.apiService.login({
          email: this.email,
          password: this.password
        });

        if (response.token) {
          localStorage.setItem('user_token', response.token);
        }

        if (response.user && response.user.name) {
          localStorage.setItem('user_name', response.user.name);
        }

        this.router.navigate(['/dashboard']);
        
      } catch (error) {
        console.error('Erro no login:', error);
        alert('E-mail ou senha incorretos.');
      }
    } else {
      alert('Por favor, preencha todos os campos!');
    }
  }
}