import { Component, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '../components/auth-layout/auth-layout.component';
import { ApiService } from '../../../services/api.service'; 
import {
  LucideAngularModule,
  User,
  Mail,
  Lock,
  ArrowRight,
  Camera,
} from 'lucide-angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AuthLayoutComponent,
    LucideAngularModule,
  ],
  template: `
    <app-auth-layout>
      <div class="w-full">
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4 mt-4">
          
          <div class="space-y-1">
            <label class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider">Nome Completo</label>
            <input type="text" formControlName="name" class="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white" placeholder="Seu nome" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider">Usuário</label>
              <input type="text" formControlName="username" class="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white" placeholder="@usuario" />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider">Nascimento</label>
              <input type="date" formControlName="birthDate" class="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider">E-mail</label>
            <input type="email" formControlName="email" class="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white" placeholder="seu@email.com" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider">Senha</label>
              <input type="password" formControlName="password" class="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white" placeholder="••••••" />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider">Confirmar Senha</label>
              <input type="password" formControlName="confirmPassword" class="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white" placeholder="••••••" />
            </div>
          </div>

          <div class="flex items-center gap-2 mt-4 px-1">
            <input type="checkbox" id="terms" formControlName="terms" class="w-4 h-4 text-[#243a5f] border-gray-300 rounded" />
            <label for="terms" class="text-xs text-slate-600 dark:text-gray-400 cursor-pointer">Li e aceito os termos e condições.</label>
          </div>

          <button type="submit" [disabled]="registerForm.invalid || isLoading" class="w-full bg-[#243a5f] hover:bg-[#1b2b47] text-white font-bold py-3.5 rounded-full transition transform active:scale-[0.99] text-sm uppercase tracking-widest shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
            <span *ngIf="!isLoading">Cadastrar</span>
            <span *ngIf="isLoading">Criando...</span>
          </button>
        </form>

        <div class="text-center mt-6">
           <a routerLink="/login" class="text-[#243a5f] dark:text-blue-300 font-bold text-sm hover:underline">JÁ TENHO UMA CONTA</a>
        </div>
      </div>
    </app-auth-layout>
  `,
  styles: [
    `.social-btn { @apply w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors text-slate-700 dark:text-gray-200 font-medium text-sm bg-white dark:bg-gray-800; }`
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  photoBase64: string | null = null;
  readonly icons = { User, Mail, Lock, ArrowRight, Camera };

  private apiService = inject(ApiService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]],
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.photoBase64 = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }
      this.isLoading = true;
      try {
        const dadosParaEnviar = { ...this.registerForm.value, photo: this.photoBase64 };
        await this.apiService.register(dadosParaEnviar);
        alert('Cadastro realizado com sucesso!');
        this.router.navigate(['/login']);
      } catch (error) {
        alert('Erro ao cadastrar usuário.');
      } finally {
        this.isLoading = false;
      }
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}