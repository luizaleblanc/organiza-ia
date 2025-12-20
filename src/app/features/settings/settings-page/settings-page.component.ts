import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  User,
  Shield,
  Bell,
  Settings,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  LogOut,
  Moon,
  Sun,
  Check,
} from 'lucide-angular';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    RouterModule,
  ],
  template: `
    <div
      class="min-h-screen bg-[#eff6ff] dark:bg-black text-gray-900 dark:text-white relative font-sans transition-colors duration-300 selection:bg-blue-500 selection:text-white"
    >
      <header
        class="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 dark:bg-black/90 backdrop-blur-md border-b border-blue-100 dark:border-gray-800 shadow-sm transition-all duration-300"
      >
        <div
          class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between"
        >
          <div class="flex items-center gap-4">
            <a
              (click)="goBack()"
              class="p-2 -ml-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-white transition-all focus:outline-none cursor-pointer"
              title="Voltar"
            >
              <lucide-icon [img]="icons.ArrowLeft" [size]="24"></lucide-icon>
            </a>

            <a routerLink="/dashboard" class="flex-shrink-0 cursor-pointer">
              <img
                src="assets/logo.png"
                alt="Logo Organiza Aí"
                class="h-12 w-auto object-contain transition-all dark:brightness-0 dark:invert"
              />
            </a>
          </div>

          <div class="flex items-center">
            <div class="relative">
              <button
                (click)="toggleDropdown()"
                class="flex items-center gap-3 py-2 px-3 rounded-full hover:bg-blue-50 dark:hover:bg-gray-900 transition-colors border border-transparent hover:border-blue-100 dark:hover:border-gray-800 focus:outline-none"
              >
                <div
                  class="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center border border-blue-200 dark:border-blue-500/30"
                >
                  <lucide-icon
                    [img]="icons.User"
                    [size]="18"
                    class="text-blue-600 dark:text-blue-400"
                  ></lucide-icon>
                </div>

                <div class="hidden sm:flex flex-col items-start">
                  <span
                    class="text-xs text-gray-500 dark:text-gray-400 font-medium"
                    >Bem-vinda,</span
                  >
                  <span
                    class="text-sm font-bold text-gray-900 dark:text-white leading-none"
                    >Luiza</span
                  >
                </div>

                <lucide-icon
                  [img]="dropdownOpen ? icons.ChevronUp : icons.ChevronDown"
                  [size]="16"
                  class="text-gray-500 ml-1"
                ></lucide-icon>
              </button>

              <div
                *ngIf="dropdownOpen"
                class="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-white dark:bg-gray-900 border border-blue-100 dark:border-gray-700 ring-1 ring-black ring-opacity-5 z-50 animate-fade-in overflow-hidden divide-y divide-gray-100 dark:divide-gray-800"
              >
                <div class="py-3 px-4 bg-blue-50/50 dark:bg-gray-900">
                  <p
                    class="text-xs text-gray-500 uppercase tracking-wider font-bold"
                  >
                    Conta
                  </p>
                  <p
                    class="text-sm font-medium text-gray-900 dark:text-white truncate mt-1"
                  >
                    luizaa.fq&#64;gmail.com
                  </p>
                </div>

                <div class="py-1">
                  <a
                    (click)="dropdownOpen = false"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <lucide-icon
                      [img]="icons.Settings"
                      [size]="16"
                    ></lucide-icon>
                    Configurações
                  </a>
                </div>

                <div class="py-1">
                  <a
                    (click)="logout()"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer font-medium"
                  >
                    <lucide-icon [img]="icons.LogOut" [size]="16"></lucide-icon>
                    Sair da Conta
                  </a>
                </div>
              </div>
            </div>

            <div
              *ngIf="dropdownOpen"
              (click)="closeDropdown()"
              class="fixed inset-0 z-40"
            ></div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <h1
          class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 px-2"
        >
          CONFIGURAÇÕES
        </h1>

        <div class="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          <aside class="flex flex-col gap-1">
            <button
              class="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#111625] text-blue-600 dark:text-blue-500 font-medium rounded-lg border-l-2 border-blue-500 transition-all shadow-sm"
            >
              <lucide-icon [img]="icons.User" class="w-5 h-5"></lucide-icon>
              Perfil & Preferências
            </button>

            <button
              class="flex items-center justify-between px-4 py-3 text-gray-500 dark:text-gray-500 hover:bg-white/60 dark:hover:bg-gray-900/50 hover:text-blue-600 dark:hover:text-gray-300 rounded-lg transition-all group"
            >
              <div class="flex items-center gap-3">
                <lucide-icon [img]="icons.Shield" class="w-5 h-5"></lucide-icon>
                Segurança
              </div>
              <span
                class="text-[10px] bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-gray-500 px-2 py-0.5 rounded border border-blue-200 dark:border-gray-700"
                >Em breve</span
              >
            </button>

            <button
              class="flex items-center justify-between px-4 py-3 text-gray-500 dark:text-gray-500 hover:bg-white/60 dark:hover:bg-gray-900/50 hover:text-blue-600 dark:hover:text-gray-300 rounded-lg transition-all group"
            >
              <div class="flex items-center gap-3">
                <lucide-icon [img]="icons.Bell" class="w-5 h-5"></lucide-icon>
                Notificações
              </div>
              <span
                class="text-[10px] bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-gray-500 px-2 py-0.5 rounded border border-blue-200 dark:border-gray-700"
                >Em breve</span
              >
            </button>
          </aside>

          <section class="flex flex-col gap-6">
            <div
              class="border border-blue-100 dark:border-gray-800 rounded-xl bg-white dark:bg-[#050505] p-8 relative overflow-hidden shadow-sm dark:shadow-none"
            >
              <div class="flex items-start gap-4 mb-8 relative z-10">
                <div
                  class="p-3 bg-blue-50 dark:bg-[#0F172A] rounded-lg text-blue-600 dark:text-blue-500 border border-blue-100 dark:border-blue-900/20"
                >
                  <lucide-icon [img]="icons.User" class="w-6 h-6"></lucide-icon>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                    Meus Dados
                  </h2>
                  <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Gerencie suas informações pessoais e de contato.
                  </p>
                </div>
              </div>

              <form
                [formGroup]="settingsForm"
                (ngSubmit)="onSubmit()"
                class="space-y-6 relative z-10"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label
                      class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >Nome Completo</label
                    >
                    <input
                      type="text"
                      formControlName="nome"
                      class="w-full bg-blue-50/50 dark:bg-[#0f111a] border border-blue-100 dark:border-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-600 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all"
                    />
                  </div>
                  <div class="space-y-2">
                    <label
                      class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >Usuário</label
                    >
                    <input
                      type="text"
                      formControlName="usuario"
                      class="w-full bg-blue-50/50 dark:bg-[#0f111a] border border-blue-100 dark:border-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-600 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all"
                    />
                  </div>
                </div>
                <div class="space-y-2">
                  <label
                    class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >E-mail Principal</label
                  >
                  <input
                    type="email"
                    formControlName="email"
                    class="w-full bg-blue-50/50 dark:bg-[#0f111a] border border-blue-100 dark:border-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-600 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all"
                  />
                </div>
                <div class="space-y-2">
                  <label
                    class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >Data de Nascimento</label
                  >
                  <input
                    type="text"
                    placeholder="dd/mm/aaaa"
                    formControlName="nascimento"
                    class="w-full bg-blue-50/50 dark:bg-[#0f111a] border border-blue-100 dark:border-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-600 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all"
                  />
                </div>
                <div class="pt-4 flex justify-end">
                  <button
                    type="submit"
                    class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-500/30 dark:shadow-blue-900/30 transition-all"
                  >
                    SALVAR ALTERAÇÕES
                  </button>
                </div>
              </form>
            </div>

            <div
              class="rounded-xl bg-white dark:bg-[#0f1322] p-6 border border-blue-100 dark:border-[#1e2538] shadow-sm dark:shadow-none"
            >
              <div class="flex items-start gap-4 mb-8">
                <div
                  class="p-3 bg-purple-50 dark:bg-[#161b2e] rounded-lg text-purple-600 dark:text-blue-400 shadow-sm border border-purple-100 dark:border-[#232942]"
                >
                  <lucide-icon [img]="icons.Moon" class="w-6 h-6"></lucide-icon>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                    Aparência do Sistema
                  </h2>
                  <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Personalize sua experiência visual.
                  </p>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-base font-bold text-gray-900 dark:text-white">
                    Modo Escuro
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Ajusta o brilho da tela para ambientes com pouca luz
                  </p>
                </div>

                <button
                  (click)="toggleTheme()"
                  class="relative w-16 h-8 rounded-full transition-colors duration-300 ease-in-out focus:outline-none cursor-pointer"
                  [ngClass]="isDarkMode ? 'bg-blue-600' : 'bg-gray-200'"
                >
                  <div
                    class="absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 flex items-center justify-center shadow-md"
                    [ngClass]="isDarkMode ? 'translate-x-8' : 'translate-x-0'"
                  >
                    <lucide-icon
                      *ngIf="isDarkMode"
                      [img]="icons.Moon"
                      class="w-4 h-4 text-blue-600 fill-current"
                    ></lucide-icon>

                    <lucide-icon
                      *ngIf="!isDarkMode"
                      [img]="icons.Sun"
                      class="w-4 h-4 text-yellow-500 fill-current"
                    ></lucide-icon>
                  </div>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in {
        animation: fadeIn 0.15s ease-out forwards;
      }
    `,
  ],
})
export class SettingsPageComponent implements OnInit {
  settingsForm: FormGroup;
  isDarkMode: boolean = true;
  dropdownOpen: boolean = false;

  readonly icons = {
    User,
    Shield,
    Bell,
    Settings,
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    LogOut,
    Moon,
    Sun,
    Check,
  };

  constructor(private fb: FormBuilder, private location: Location) {
    this.settingsForm = this.fb.group({
      nome: ['Luiza LeBlanc'],
      usuario: ['@luiza.lb'],
      email: ['luizaa.fq@gmail.com'],
      nascimento: [''],
    });
  }

  ngOnInit(): void {
    this.checkTheme();
  }

  goBack(): void {
    this.location.back();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  logout() {
    console.log('Logout acionado');
    this.dropdownOpen = false;
  }

  checkTheme() {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;

      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        this.enableDarkMode();
      } else {
        this.disableDarkMode();
      }
    }
  }

  toggleTheme() {
    if (this.isDarkMode) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  private enableDarkMode() {
    this.isDarkMode = true;
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }

  private disableDarkMode() {
    this.isDarkMode = false;
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }

  onSubmit() {
    if (this.settingsForm.valid) {
      console.log('Dados do formulário:', this.settingsForm.value);
      alert('Configurações salvas! Verifique o console.');
    }
  }
}
