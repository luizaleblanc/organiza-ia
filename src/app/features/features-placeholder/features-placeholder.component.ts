import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../../shared/components/dashboard-layout/dashboard-layout.component';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-features-placeholder',
  standalone: true,
  imports: [
    CommonModule,
    DashboardLayoutComponent,
    LucideAngularModule,
    RouterModule,
  ],
  template: `
    <app-dashboard-layout>
      <div class="space-y-6 max-w-6xl mx-auto">
        <h1
          class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6"
        >
          CONFIGURAÇÕES
        </h1>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div class="lg:col-span-1 space-y-2">
            <button
              class="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-900/20 text-blue-400 font-bold border border-blue-800/50"
            >
              <lucide-icon name="user" [size]="20"></lucide-icon>
              Perfil & Preferências
            </button>
            <button
              class="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <lucide-icon name="shield" [size]="20"></lucide-icon>
              Segurança
              <span
                class="ml-auto text-[10px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded border border-gray-700"
                >Em breve</span
              >
            </button>
            <button
              class="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <lucide-icon name="bell" [size]="20"></lucide-icon>
              Notificações
              <span
                class="ml-auto text-[10px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded border border-gray-700"
                >Em breve</span
              >
            </button>
          </div>

          <div class="lg:col-span-3 space-y-8">
            <div
              class="bg-black rounded-xl border border-gray-800 overflow-hidden"
            >
              <div class="p-6 border-b border-gray-800 flex items-center gap-4">
                <div
                  class="h-10 w-10 rounded-lg bg-blue-900/20 flex items-center justify-center border border-blue-500/20"
                >
                  <lucide-icon
                    name="user-cog"
                    [size]="20"
                    class="text-blue-400"
                  ></lucide-icon>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-white">Meus Dados</h3>
                  <p class="text-gray-400 text-sm">
                    Gerencie suas informações pessoais e de contato.
                  </p>
                </div>
              </div>

              <div class="p-6 space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-1">
                    <label
                      class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1"
                      >Nome Completo</label
                    >
                    <div
                      class="bg-gray-900 border border-gray-700 rounded-lg flex items-center px-4 py-3"
                    >
                      <input
                        type="text"
                        value="Luiza LeBlanc"
                        class="bg-transparent border-none w-full text-white font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                  <div class="space-y-1">
                    <label
                      class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1"
                      >Usuário</label
                    >
                    <div
                      class="bg-gray-900 border border-gray-700 rounded-lg flex items-center px-4 py-3"
                    >
                      <input
                        type="text"
                        value="&#64;luiza.lb"
                        class="bg-transparent border-none w-full text-white font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div class="space-y-1">
                  <label
                    class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1"
                    >E-mail Principal</label
                  >
                  <div
                    class="bg-gray-900 border border-gray-700 rounded-lg flex items-center px-4 py-3"
                  >
                    <input
                      type="email"
                      value="luizaa.fq&#64;gmail.com"
                      class="bg-transparent border-none w-full text-white font-medium focus:outline-none"
                    />
                  </div>
                </div>

                <div class="space-y-1">
                  <label
                    class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1"
                    >Data de Nascimento</label
                  >
                  <div
                    class="bg-gray-900 border border-gray-700 rounded-lg flex items-center px-4 py-3 relative"
                  >
                    <input
                      type="text"
                      placeholder="dd/mm/aaaa"
                      class="bg-transparent border-none w-full text-gray-400 font-medium focus:outline-none"
                    />
                  </div>
                </div>

                <div class="flex justify-end pt-4 border-t border-gray-800">
                  <button
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all uppercase tracking-wide"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>

            <div
              class="bg-black rounded-xl border border-gray-800 overflow-hidden"
            >
              <div class="p-6 border-b border-gray-800 flex items-center gap-4">
                <div
                  class="h-10 w-10 rounded-lg bg-purple-900/20 flex items-center justify-center border border-purple-500/20"
                >
                  <lucide-icon
                    name="moon"
                    [size]="20"
                    class="text-purple-400"
                  ></lucide-icon>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-white">
                    Aparência do Sistema
                  </h3>
                  <p class="text-gray-400 text-sm">
                    Personalize sua experiência visual.
                  </p>
                </div>
              </div>

              <div class="p-6">
                <div
                  class="flex justify-between items-center bg-gray-900/50 p-4 rounded-lg border border-gray-700"
                >
                  <div>
                    <span class="text-white font-bold block">Modo Escuro</span>
                    <span class="text-xs text-gray-400"
                      >Alternar entre tema claro e escuro.</span
                    >
                  </div>

                  <div
                    class="w-12 h-6 rounded-full relative transition-colors duration-300 cursor-pointer"
                    [ngClass]="
                      themeService.darkMode() ? 'bg-blue-600' : 'bg-gray-600'
                    "
                    (click)="themeService.toggleTheme()"
                  >
                    <div
                      class="w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm"
                      [ngClass]="themeService.darkMode() ? 'left-7' : 'left-1'"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-dashboard-layout>
  `,
})
export class FeaturesPlaceholderComponent {
  public themeService = inject(ThemeService);
}
