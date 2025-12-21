import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  LucideAngularModule,
  ArrowLeft,
  User,
  ChevronUp,
  ChevronDown,
  Settings,
  LogOut,
} from 'lucide-angular';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
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
              *ngIf="isSettingsPage"
              routerLink="/dashboard"
              class="p-2 -ml-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-white transition-all focus:outline-none cursor-pointer"
              title="Voltar ao Dashboard"
            >
              <lucide-icon [img]="icons.ArrowLeft" [size]="24"></lucide-icon>
            </a>

            <a routerLink="/dashboard" class="flex-shrink-0 cursor-pointer">
              <img
                src="assets/logo.png"
                alt="Logo Organiza Aí"
                class="h-16 w-auto object-contain transition-all dark:brightness-0 dark:invert"
              />
            </a>
          </div>

          <div class="flex items-center">
            <div class="relative z-[60]">
              <button
                (click)="toggleDropdown()"
                class="flex items-center gap-3 py-2 px-3 rounded-full hover:bg-blue-50 dark:hover:bg-gray-900 transition-colors border border-transparent hover:border-blue-100 dark:hover:border-gray-800 focus:outline-none"
              >
                <div
                  class="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center border border-blue-200 dark:border-blue-500/30 overflow-hidden"
                >
                  <img
                    *ngIf="userPhoto"
                    [src]="userPhoto"
                    alt="Foto de perfil"
                    class="h-full w-full object-cover"
                  />
                  <lucide-icon
                    *ngIf="!userPhoto"
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
                    routerLink="/settings"
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
                  <button
                    type="button"
                    (click)="logout()"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer font-medium text-left"
                  >
                    <lucide-icon [img]="icons.LogOut" [size]="16"></lucide-icon>
                    Sair da Conta
                  </button>
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

      <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pt-28">
        <ng-content></ng-content>
      </main>
    </div>
  `,
  styles: [
    `
      .animate-fade-in {
        animation: fadeIn 0.15s ease-out forwards;
      }
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
    `,
  ],
})
export class DashboardLayoutComponent implements OnInit {
  dropdownOpen = false;
  isSettingsPage = false;
  userPhoto: string | null = null;

  readonly icons = {
    ArrowLeft,
    User,
    ChevronUp,
    ChevronDown,
    Settings,
    LogOut,
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkTheme();
    if (typeof localStorage !== 'undefined') {
      const savedPhoto = localStorage.getItem('userPhoto');
      if (savedPhoto) {
        this.userPhoto = savedPhoto;
      }
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  logout() {
    console.log('--- LOGOUT INICIADO ---');
    this.dropdownOpen = false;

    const currentTheme = localStorage.getItem('theme');

    localStorage.clear();
    sessionStorage.clear();

    if (currentTheme) {
      localStorage.setItem('theme', currentTheme);
    }

    // CORREÇÃO: Usar a rota /login
    this.router
      .navigate(['/login'])
      .then((success) => {
        if (!success) {
          window.location.href = '/login';
        }
      })
      .catch(() => {
        window.location.href = '/login';
      });
  }

  checkTheme() {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;

      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
}
