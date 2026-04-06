import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
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

function fullNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const words = control.value.trim().split(/\s+/);
    return words.length >= 2 ? null : { incompleteName: true };
  };
}

function minAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= minAge ? null : { underage: true };
  };
}

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
        <div
          *ngIf="errorMessage"
          class="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-4 flex items-center gap-3 animate-fade-in text-sm font-medium"
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

        <div
          *ngIf="successMessage"
          class="bg-green-500/10 border border-green-500/50 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl mb-4 flex items-center gap-3 animate-fade-in text-sm font-medium"
        >
          <lucide-icon [img]="icons.CheckCircle" [size]="18"></lucide-icon>
          {{ successMessage }}
        </div>

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
              class="w-full pl-14 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white"
              [ngClass]="{
                'border-red-500': isFieldInvalid('name'),
                'border-slate-300 dark:border-gray-700':
                  !isFieldInvalid('name'),
              }"
              placeholder="Seu nome e sobrenome"
            />
          </div>
          <div
            *ngIf="isFieldInvalid('name')"
            class="text-red-500 text-xs ml-1 mt-1 font-medium animate-fade-in"
          >
            <span *ngIf="registerForm.get('name')?.errors?.['required']"
              >O nome é obrigatório.</span
            >
            <span
              *ngIf="
                registerForm.get('name')?.errors?.['incompleteName'] &&
                !registerForm.get('name')?.errors?.['required']
              "
              >Por favor, insira pelo menos um nome e um sobrenome.</span
            >
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
              class="w-full pl-14 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white"
              [ngClass]="{
                'border-red-500': isFieldInvalid('username'),
                'border-slate-300 dark:border-gray-700':
                  !isFieldInvalid('username'),
              }"
              placeholder="@usuario"
            />
          </div>
          <div
            *ngIf="isFieldInvalid('username')"
            class="text-red-500 text-xs ml-1 mt-1 font-medium animate-fade-in"
          >
            <span *ngIf="registerForm.get('username')?.errors?.['required']"
              >O nome de usuário é obrigatório.</span
            >
            <span *ngIf="registerForm.get('username')?.errors?.['minlength']"
              >O usuário deve ter pelo menos 3 caracteres.</span
            >
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
              class="w-full pl-14 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white"
              [ngClass]="{
                'border-red-500': isFieldInvalid('email'),
                'border-slate-300 dark:border-gray-700':
                  !isFieldInvalid('email'),
              }"
              placeholder="seu@email.com"
            />
          </div>
          <div
            *ngIf="isFieldInvalid('email')"
            class="text-red-500 text-xs ml-1 mt-1 font-medium animate-fade-in"
          >
            <span *ngIf="registerForm.get('email')?.errors?.['required']"
              >O e-mail é obrigatório.</span
            >
            <span
              *ngIf="
                registerForm.get('email')?.errors?.['pattern'] &&
                !registerForm.get('email')?.errors?.['required']
              "
              >Insira um e-mail válido (ex: nome&#64;dominio.com).</span
            >
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
              class="w-full pl-14 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white"
              [ngClass]="{
                'border-red-500': isFieldInvalid('birthDate'),
                'border-slate-300 dark:border-gray-700':
                  !isFieldInvalid('birthDate'),
              }"
            />
          </div>
          <div
            *ngIf="isFieldInvalid('birthDate')"
            class="text-red-500 text-xs ml-1 mt-1 font-medium animate-fade-in"
          >
            <span *ngIf="registerForm.get('birthDate')?.errors?.['required']"
              >A data de nascimento é obrigatória.</span
            >
            <span
              *ngIf="
                registerForm.get('birthDate')?.errors?.['underage'] &&
                !registerForm.get('birthDate')?.errors?.['required']
              "
              >Você deve ter pelo menos 15 anos para se cadastrar.</span
            >
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
              class="w-full pl-14 pr-12 py-3 bg-slate-50 dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white"
              [ngClass]="{
                'border-red-500': isFieldInvalid('password'),
                'border-slate-300 dark:border-gray-700':
                  !isFieldInvalid('password'),
              }"
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
          <div
            *ngIf="isFieldInvalid('password')"
            class="text-red-500 text-xs ml-1 mt-1 font-medium animate-fade-in"
          >
            <span *ngIf="registerForm.get('password')?.errors?.['required']"
              >A senha é obrigatória.</span
            >
            <span *ngIf="registerForm.get('password')?.errors?.['minlength']"
              >A senha deve ter pelo menos 6 caracteres.</span
            >
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
              class="w-full pl-14 pr-12 py-3 bg-slate-50 dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 transition text-[#243a5f] dark:text-white"
              [ngClass]="{
                'border-red-500':
                  registerForm.errors?.['notSame'] &&
                  registerForm.get('confirmPassword')?.touched,
                'border-slate-300 dark:border-gray-700': !(
                  registerForm.errors?.['notSame'] &&
                  registerForm.get('confirmPassword')?.touched
                ),
              }"
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
          <div
            *ngIf="
              registerForm.errors?.['notSame'] &&
              registerForm.get('confirmPassword')?.touched
            "
            class="text-red-500 text-xs ml-1 mt-1 font-medium animate-fade-in"
          >
            As senhas não coincidem.
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
            [disabled]="registerForm.invalid || isSubmitting"
            class="flex-1 bg-[#243a5f] hover:bg-[#1a2a4a] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition transform active:scale-[0.99] text-sm uppercase tracking-widest shadow-md"
          >
            {{ isSubmitting ? 'Aguarde...' : 'Cadastrar' }}
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
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  readonly icons = { Mail, Lock, User, Calendar, Eye, EyeOff, CheckCircle };

  private emailRegex = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

  registerForm = this.fb.group(
    {
      name: ['', [Validators.required, fullNameValidator()]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      birthDate: ['', [Validators.required, minAgeValidator(15)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]],
    },
    {
      validators: (group: AbstractControl) => {
        const pass = group.get('password')?.value;
        const confirmPass = group.get('confirmPassword')?.value;
        return pass === confirmPass ? null : { notSame: true };
      },
    },
  );

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  async onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage =
        'Por favor, corrija os erros destacados no formulário.';
      return;
    }

    this.isSubmitting = true;

    try {
      await this.apiService.register(this.registerForm.value);
      this.successMessage = 'Cadastro realizado com sucesso! Redirecionando...';
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK') {
        this.errorMessage =
          'Erro de conexão: O servidor está desligado ou inacessível. Verifique se o Back-end está rodando na porta 8000.';
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.detail
      ) {
        const detail = error.response.data.detail;
        this.errorMessage = Array.isArray(detail) ? detail[0].msg : detail;
      } else {
        this.errorMessage =
          'Erro interno no servidor. Tente novamente mais tarde.';
      }
    } finally {
      this.isSubmitting = false;
    }
  }
}
