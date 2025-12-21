import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '../components/auth-layout/auth-layout.component';
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
        <form
          [formGroup]="registerForm"
          (ngSubmit)="onSubmit()"
          class="space-y-4 mt-4"
        >
          <div class="space-y-1">
            <label
              class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider"
            >
              Nome Completo
            </label>
            <input
              type="text"
              formControlName="name"
              class="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg hover:border-[#243a5f] dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 dark:focus:ring-blue-500/30 transition text-[#243a5f] dark:text-white"
              placeholder="Seu nome"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label
                class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider"
              >
                Usuário
              </label>
              <input
                type="text"
                formControlName="username"
                class="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg hover:border-[#243a5f] dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 dark:focus:ring-blue-500/30 transition text-[#243a5f] dark:text-white"
                placeholder="@usuario"
              />
            </div>
            <div class="space-y-1">
              <label
                class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider"
              >
                Nascimento
              </label>
              <input
                type="date"
                formControlName="birthDate"
                class="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg hover:border-[#243a5f] dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 dark:focus:ring-blue-500/30 transition text-[#243a5f] dark:text-white"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label
              class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider"
            >
              E-mail
            </label>
            <input
              type="email"
              formControlName="email"
              class="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg hover:border-[#243a5f] dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 dark:focus:ring-blue-500/30 transition text-[#243a5f] dark:text-white"
              placeholder="seu@email.com"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label
                class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider"
              >
                Senha
              </label>
              <input
                type="password"
                formControlName="password"
                class="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg hover:border-[#243a5f] dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 dark:focus:ring-blue-500/30 transition text-[#243a5f] dark:text-white"
                placeholder="••••••"
              />
            </div>
            <div class="space-y-1">
              <label
                class="text-xs font-bold text-[#243a5f] dark:text-blue-200 ml-1 uppercase tracking-wider"
              >
                Confirmar Senha
              </label>
              <input
                type="password"
                formControlName="confirmPassword"
                class="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg hover:border-[#243a5f] dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-[#243a5f]/30 dark:focus:ring-blue-500/30 transition text-[#243a5f] dark:text-white"
                placeholder="••••••"
              />
            </div>
          </div>

          <p
            class="text-xs text-slate-500 dark:text-gray-400 leading-tight px-1"
          >
            Mínimo de 8 caracteres, letras maiúsculas, minúsculas e caractere
            especial (&#64;, #).
          </p>

          <div class="flex items-center gap-2 mt-4 px-1">
            <input
              type="checkbox"
              id="terms"
              formControlName="terms"
              class="w-4 h-4 text-[#243a5f] border-gray-300 dark:border-gray-600 rounded focus:ring-[#243a5f] dark:focus:ring-blue-500 bg-white dark:bg-gray-800"
            />
            <label
              for="terms"
              class="text-xs text-slate-600 dark:text-gray-400 cursor-pointer select-none"
            >
              Li e aceito os
              <a
                href="#"
                class="text-[#243a5f] dark:text-blue-300 font-bold hover:underline"
              >
                termos e condições </a
              >.
            </label>
          </div>

          <div class="space-y-2 py-2">
            <label
              class="block text-center text-xs font-bold text-[#243a5f] dark:text-blue-200 uppercase tracking-wider"
            >
            </label>
            <div class="flex justify-center relative">
              <div
                class="relative group cursor-pointer"
                (click)="fileInput.click()"
              >
                <div
                  class="w-24 h-24 rounded-full bg-slate-50 dark:bg-gray-800 border-2 border-dashed border-slate-300 dark:border-gray-700 flex items-center justify-center overflow-hidden hover:border-[#243a5f] dark:hover:border-blue-500 transition-colors"
                >
                  <img
                    *ngIf="photoBase64"
                    [src]="photoBase64"
                    class="w-full h-full object-cover"
                  />
                  <lucide-icon
                    *ngIf="!photoBase64"
                    [img]="icons.User"
                    [size]="40"
                    class="text-slate-400 dark:text-gray-600 group-hover:text-[#243a5f] transition-colors"
                  ></lucide-icon>
                </div>

                <div
                  class="absolute bottom-0 right-0 bg-[#243a5f] rounded-full p-2 shadow-lg text-white group-hover:bg-[#1b2b47] transition-colors"
                >
                  <lucide-icon [img]="icons.Camera" [size]="16"></lucide-icon>
                </div>
              </div>

              <input
                type="file"
                #fileInput
                class="hidden"
                accept="image/*"
                (change)="onFileSelected($event)"
              />
            </div>
          </div>
          <button
            type="submit"
            [disabled]="registerForm.invalid || isLoading"
            class="w-full bg-[#243a5f] hover:bg-[#1b2b47] dark:bg-[#243a5f] dark:hover:bg-[#324b7a] dark:border dark:border-slate-700 text-white font-bold py-3.5 rounded-full transition transform active:scale-[0.99] text-sm uppercase tracking-widest shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span *ngIf="!isLoading">Cadastrar</span>
            <span *ngIf="isLoading">Criando...</span>
          </button>
        </form>

        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div
              class="w-full border-t border-slate-200 dark:border-gray-700"
            ></div>
          </div>
          <div class="relative flex justify-center text-xs">
            <span
              class="px-4 text-slate-400 bg-white dark:bg-gray-900 transition-colors"
            >
              ou cadastre-se com
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <button class="social-btn">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
            />
            <span>Continuar com o Google</span>
          </button>

          <button class="social-btn">
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              alt="Facebook"
            />
            <span>Continuar com o Facebook</span>
          </button>

          <button class="social-btn">
            <img
              src="assets/apple.png"
              alt="Apple"
              class="rounded-full dark:invert"
            />
            <span>Continuar com a Apple</span>
          </button>
        </div>
      </div>
    </app-auth-layout>
  `,
  styles: [
    `
      .social-btn {
        @apply w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors text-slate-700 dark:text-gray-200 font-medium text-sm bg-white dark:bg-gray-800;
      }
      .social-btn img {
        @apply w-5 h-5;
      }
    `,
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  photoBase64: string | null = null;

  readonly icons = { User, Mail, Lock, ArrowRight, Camera };

  constructor(private fb: FormBuilder, private router: Router) {
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
      reader.onload = (e: any) => {
        this.photoBase64 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      setTimeout(() => {
        console.log('Dados do registro:', {
          ...this.registerForm.value,
          photo: this.photoBase64 ? 'Foto anexada' : 'Sem foto',
        });

        if (this.photoBase64) {
          localStorage.setItem('userPhoto', this.photoBase64);
        }

        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }, 1500);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
