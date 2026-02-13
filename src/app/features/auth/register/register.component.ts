import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Mail,
  Lock,
  User,
  Calendar,
  Eye,
  EyeOff,
  CheckCircle,
} from 'lucide-angular';
import { AuthLayoutComponent } from '../components/auth-layout/auth-layout.component';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    LucideAngularModule,
    AuthLayoutComponent,
  ],
  template: `
    <app-auth-layout>
      <form
        [formGroup]="registerForm"
        (ngSubmit)="onSubmit()"
        class="space-y-4"
      >
        <div class="space-y-1">
          <label
            class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider"
            >Nome Completo</label
          >
          <div class="relative flex items-center">
            <lucide-icon
              [img]="icons.User"
              class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"
              [size]="18"
            ></lucide-icon>
            <input
              formControlName="name"
              type="text"
              class="w-full pl-14 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white"
              placeholder="Seu nome completo"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label
            class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider"
            >Nome de Usuário</label
          >
          <div class="relative flex items-center">
            <lucide-icon
              [img]="icons.User"
              class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"
              [size]="18"
            ></lucide-icon>
            <input
              formControlName="username"
              type="text"
              class="w-full pl-14 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white"
              placeholder="@usuario"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label
            class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider"
            >E-mail</label
          >
          <div class="relative flex items-center">
            <lucide-icon
              [img]="icons.Mail"
              class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"
              [size]="18"
            ></lucide-icon>
            <input
              formControlName="email"
              type="email"
              class="w-full pl-14 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white"
              placeholder="seu@email.com"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label
            class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider"
            >Data de Nascimento</label
          >
          <div class="relative flex items-center">
            <lucide-icon
              [img]="icons.Calendar"
              class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"
              [size]="18"
            ></lucide-icon>
            <input
              formControlName="birthDate"
              type="date"
              class="w-full pl-14 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label
            class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider"
            >Senha</label
          >
          <div class="relative flex items-center">
            <lucide-icon
              [img]="icons.Lock"
              class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"
              [size]="18"
            ></lucide-icon>
            <input
              formControlName="password"
              [type]="showPassword ? 'text' : 'password'"
              class="w-full pl-14 pr-12 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white"
              placeholder="••••••"
            />
            <button
              type="button"
              (click)="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#243a5f] focus:outline-none z-10"
            >
              <lucide-icon
                [img]="showPassword ? icons.EyeOff : icons.Eye"
                [size]="18"
              ></lucide-icon>
            </button>
          </div>
        </div>

        <div class="space-y-1">
          <label
            class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider"
            >Confirmar Senha</label
          >
          <div class="relative flex items-center">
            <lucide-icon
              [img]="icons.Lock"
              class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"
              [size]="18"
            ></lucide-icon>
            <input
              formControlName="confirmPassword"
              [type]="showConfirmPassword ? 'text' : 'password'"
              class="w-full pl-14 pr-12 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white"
              placeholder="••••••"
            />
            <button
              type="button"
              (click)="showConfirmPassword = !showConfirmPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#243a5f] focus:outline-none z-10"
            >
              <lucide-icon
                [img]="showConfirmPassword ? icons.EyeOff : icons.Eye"
                [size]="18"
              ></lucide-icon>
            </button>
          </div>
        </div>

        <div class="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            formControlName="terms"
            id="terms"
            class="w-4 h-4 text-[#243a5f] border-gray-300 rounded focus:ring-[#243a5f]"
          />
          <label for="terms" class="text-xs text-slate-600 dark:text-slate-400">
            Eu aceito os
            <a
              href="#"
              class="text-[#243a5f] dark:text-blue-400 font-bold underline"
              >termos de uso</a
            >
            e política de privacidade.
          </label>
        </div>

        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            [disabled]="registerForm.invalid"
            class="flex-1 bg-[#243a5f] hover:bg-[#1a2a4a] disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl transition transform active:scale-[0.99] text-sm uppercase tracking-widest shadow-md"
          >
            Cadastrar
          </button>
          <a
            routerLink="/login"
            class="flex-1 border-2 border-[#243a5f] text-[#243a5f] dark:border-blue-400 dark:text-blue-400 hover:bg-[#243a5f]/10 font-bold py-3.5 rounded-xl text-center transition transform active:scale-[0.99] text-sm uppercase tracking-widest flex justify-center items-center cursor-pointer"
          >
            Voltar
          </a>
        </div>
      </form>
    </app-auth-layout>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);

  showPassword = false;
  showConfirmPassword = false;
  readonly icons = { Mail, Lock, User, Calendar, Eye, EyeOff, CheckCircle };

  registerForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]],
    },
    {
      validators: (group: any) => {
        const pass = group.get('password').value;
        const confirmPass = group.get('confirmPassword').value;
        return pass === confirmPass ? null : { notSame: true };
      },
    },
  );

  async onSubmit() {
    if (this.registerForm.valid) {
      try {
        await this.apiService.register(this.registerForm.value);
        this.router.navigate(['/login']);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
