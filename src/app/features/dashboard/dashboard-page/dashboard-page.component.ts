import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../../../shared/components/dashboard-layout/dashboard-layout.component';
import { UploadCardComponent } from '../upload-cart/upload-card.component';
import { LucideAngularModule } from 'lucide-angular';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { RouterModule } from '@angular/router';

interface Bill {
  id: number;
  date: string;
  category: string;
  amount: number;
  status: 'Processada' | 'Pendente' | 'Erro';
}

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    DashboardLayoutComponent,
    UploadCardComponent,
    LucideAngularModule,
    BaseChartDirective,
    RouterModule,
  ],
  template: `
    <app-dashboard-layout>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        <div class="lg:col-span-2 flex flex-col gap-6">
          <app-upload-card
            (fileUploaded)="onFileUploaded($event)"
          ></app-upload-card>

          <div
            *ngIf="showAnalysis"
            class="rounded-xl shadow-lg p-6 border-2 animate-fade-in transition-colors duration-300
                   bg-white dark:bg-black 
                   border-blue-100 dark:border-gray-800"
          >
            <div
              class="mb-6 border-b border-gray-100 dark:border-gray-800 pb-4"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <lucide-icon
                    name="pie-chart"
                    [size]="20"
                    class="text-blue-600 dark:text-blue-400"
                  ></lucide-icon>
                  <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                    Análise de Gastos
                  </h2>
                </div>

                <div class="flex space-x-2">
                  <button
                    (click)="setViewMode('charts')"
                    [ngClass]="{
                      'bg-blue-600 text-white font-bold shadow-md':
                        viewMode === 'charts',
                      'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 font-medium':
                        viewMode !== 'charts'
                    }"
                    class="px-3 py-1 rounded-full text-sm transition-all"
                  >
                    Gráficos
                  </button>
                  <button
                    (click)="setViewMode('topics')"
                    [ngClass]="{
                      'bg-blue-600 text-white font-bold shadow-md':
                        viewMode === 'topics',
                      'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 font-medium':
                        viewMode !== 'topics'
                    }"
                    class="px-3 py-1 rounded-full text-sm transition-all"
                  >
                    Tópicos
                  </button>
                </div>
              </div>
            </div>

            <div
              *ngIf="viewMode === 'charts'"
              class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center mb-8"
            >
              <div class="w-full max-w-[300px]">
                <canvas
                  baseChart
                  [data]="pieChartData"
                  [type]="pieChartType"
                  [options]="pieChartOptions"
                >
                </canvas>
              </div>

              <div class="w-full">
                <div
                  class="p-4 rounded-lg border transition-colors duration-300
                            bg-gray-50 dark:bg-[#111111] 
                            border-gray-200 dark:border-gray-800"
                >
                  <h3
                    class="font-semibold text-gray-700 dark:text-gray-200 mb-3"
                  >
                    Resumo da Fatura
                  </h3>
                  <div class="space-y-3">
                    <div class="flex justify-between text-sm items-center">
                      <span class="text-gray-500 dark:text-gray-400"
                        >Total Detectado</span
                      >
                      <span
                        class="font-bold text-gray-900 dark:text-white text-lg"
                        >R$ 1.245,50</span
                      >
                    </div>
                    <div
                      class="w-full border-t border-gray-200 dark:border-gray-700"
                    ></div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500 dark:text-gray-400"
                        >Maior Gasto Mensal</span
                      >
                      <span class="font-bold text-gray-900 dark:text-white">
                        R$ 520,00
                        <span
                          class="font-normal text-gray-500 dark:text-gray-400"
                          >(Alimentação)</span
                        >
                      </span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500 dark:text-gray-400"
                        >Menor Gasto Mensal</span
                      >
                      <span class="font-bold text-gray-900 dark:text-white">
                        R$ 15,90
                        <span
                          class="font-normal text-gray-500 dark:text-gray-400"
                          >(Transporte)</span
                        >
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="viewMode === 'topics'" class="space-y-6">
              <div
                class="rounded-lg p-4 border transition-colors duration-300
                          bg-gray-50 dark:bg-[#111111] 
                          border-gray-200 dark:border-gray-800"
              >
                <div
                  class="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-800"
                >
                  <lucide-icon
                    name="tag"
                    [size]="20"
                    class="text-blue-600 dark:text-blue-400"
                  ></lucide-icon>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                    Alimentação
                    <span
                      class="text-gray-500 dark:text-gray-400 font-normal text-sm"
                      >| 5 Transações</span
                    >
                  </h3>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-600 dark:text-gray-300"
                      >Supermercado XYZ</span
                    >
                    <span class="font-semibold text-red-500 dark:text-red-400"
                      >R$ 520,00</span
                    >
                  </div>
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-600 dark:text-gray-300"
                      >Restaurante Central</span
                    >
                    <span class="font-semibold text-red-500 dark:text-red-400"
                      >R$ 85,50</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center font-bold pt-3 border-t border-gray-200 dark:border-gray-800 mt-3"
                  >
                    <span class="text-gray-900 dark:text-white text-base"
                      >Total da Categoria</span
                    >
                    <span class="text-red-600 dark:text-red-500 text-base"
                      >R$ 605,50</span
                    >
                  </div>
                </div>
              </div>

              <div
                class="rounded-lg p-4 border transition-colors duration-300
                          bg-gray-50 dark:bg-[#111111] 
                          border-gray-200 dark:border-gray-800"
              >
                <div
                  class="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-800"
                >
                  <lucide-icon
                    name="car"
                    [size]="20"
                    class="text-blue-600 dark:text-blue-400"
                  ></lucide-icon>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                    Transporte
                    <span
                      class="text-gray-500 dark:text-gray-400 font-normal text-sm"
                      >| 3 Transações</span
                    >
                  </h3>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-600 dark:text-gray-300"
                      >Gasolina Posto XP</span
                    >
                    <span class="font-semibold text-red-500 dark:text-red-400"
                      >R$ 150,00</span
                    >
                  </div>
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-600 dark:text-gray-300">Uber</span>
                    <span class="font-semibold text-red-500 dark:text-red-400"
                      >R$ 15,90</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center font-bold pt-3 border-t border-gray-200 dark:border-gray-800 mt-3"
                  >
                    <span class="text-gray-900 dark:text-white text-base"
                      >Total da Categoria</span
                    >
                    <span class="text-red-600 dark:text-red-500 text-base"
                      >R$ 165,90</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex justify-center border-t border-gray-100 dark:border-gray-800 pt-6"
            >
              <button
                (click)="confirmInvoiceToHistory()"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-sm transition-all shadow-lg shadow-blue-500/30 dark:shadow-none flex items-center gap-2 uppercase tracking-wide"
              >
                <lucide-icon name="check" [size]="18"></lucide-icon>
                Processar Fatura
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div
            class="rounded-xl shadow-lg p-6 md:p-8 border-2 sticky top-24 h-fit transition-colors duration-300
                   bg-white dark:bg-black 
                   border-blue-100 dark:border-gray-800"
          >
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-2">
                <lucide-icon
                  name="clipboard-list"
                  [size]="20"
                  class="text-blue-600 dark:text-blue-400"
                ></lucide-icon>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                  Histórico
                </h2>
              </div>

              <button
                (click)="bills.length > 0 && openClearModal()"
                [disabled]="bills.length === 0"
                [ngClass]="
                  bills.length === 0
                    ? 'text-gray-400 dark:text-gray-700 cursor-not-allowed'
                    : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer'
                "
                class="p-2 rounded-lg transition-colors"
                title="Limpar Todo o Histórico"
              >
                <lucide-icon name="trash-2" [size]="20"></lucide-icon>
              </button>
            </div>

            <div class="space-y-3">
              <div
                *ngIf="bills.length === 0"
                class="text-center py-12 border-2 border-dashed rounded-lg
                       border-gray-200 dark:border-gray-700
                       bg-gray-50 dark:bg-gray-900/50"
              >
                <lucide-icon
                  name="inbox"
                  [size]="32"
                  class="mx-auto mb-2 text-gray-400 dark:text-gray-600"
                ></lucide-icon>
                <p class="font-medium text-gray-500 dark:text-gray-400">
                  Histórico Vazio
                </p>
                <p class="text-xs mt-1 text-gray-400 dark:text-gray-500">
                  Processe uma fatura para vê-la aqui.
                </p>
              </div>

              <div
                *ngFor="let bill of bills; let i = index"
                class="relative flex items-center justify-between p-3 border rounded-lg transition duration-200 animate-slide-in shadow-sm pr-2 group
                       bg-gray-50 dark:bg-black
                       border-gray-200 dark:border-gray-700
                       hover:border-blue-300 dark:hover:border-blue-500/30"
              >
                <button
                  (click)="openDeleteModal(i)"
                  class="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                  title="Excluir Transação"
                >
                  <lucide-icon name="x" [size]="14"></lucide-icon>
                </button>

                <div>
                  <p
                    class="text-sm font-semibold text-gray-900 dark:text-gray-200"
                  >
                    {{ bill.category }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ bill.date }}
                  </p>
                </div>

                <div class="flex flex-col items-end mr-6">
                  <span class="text-sm font-bold text-gray-900 dark:text-white">
                    R$ {{ bill.amount.toFixed(2) }}
                  </span>
                  <span
                    [ngClass]="getStatusClass(bill.status)"
                    class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-1 border"
                  >
                    {{ bill.status }}
                  </span>
                </div>
              </div>
            </div>

            <button
              *ngIf="bills.length > 0"
              class="w-full mt-6 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-1"
            >
              Ver Todas
              <lucide-icon name="arrow-right" [size]="14"></lucide-icon>
            </button>
          </div>
        </div>
      </div>

      <div
        *ngIf="showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      >
        <div
          class="rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4 border transform transition-all scale-100
                 bg-white dark:bg-gray-900
                 border-gray-200 dark:border-gray-700"
        >
          <div class="text-center">
            <div
              class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4"
            >
              <lucide-icon
                name="trash-2"
                class="h-6 w-6 text-red-600 dark:text-red-400"
              ></lucide-icon>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Excluir Transação?
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Tem certeza que deseja remover este item do histórico? Esta ação
              não pode ser desfeita.
            </p>
            <div class="flex justify-center gap-3">
              <button
                (click)="closeDeleteModal()"
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                (click)="confirmDelete()"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        *ngIf="showClearModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      >
        <div
          class="rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4 border transform transition-all scale-100
                 bg-white dark:bg-gray-900
                 border-gray-200 dark:border-gray-700"
        >
          <div class="text-center">
            <div
              class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4"
            >
              <lucide-icon
                name="trash-2"
                class="h-6 w-6 text-red-600 dark:text-red-400"
              ></lucide-icon>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Limpar Histórico Completo?
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Você está prestes a apagar <strong>todas</strong> as faturas do
              histórico. Isso não pode ser revertido.
            </p>
            <div class="flex justify-center gap-3">
              <button
                (click)="closeClearModal()"
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                (click)="confirmClearAll()"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Sim, Limpar Tudo
              </button>
            </div>
          </div>
        </div>
      </div>
    </app-dashboard-layout>
  `,
  styles: [
    `
      .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
      }
      .animate-slide-in {
        animation: slideIn 0.3s ease-out forwards;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(-10px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `,
  ],
})
export class DashboardPageComponent {
  @ViewChild(UploadCardComponent) uploadCard!: UploadCardComponent;

  bills: Bill[] = [];
  showAnalysis = false;
  pendingBill: Bill | null = null;
  viewMode: 'charts' | 'topics' = 'charts';
  showDeleteModal = false;
  showClearModal = false;
  itemToDeleteIndex: number | null = null;

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: { usePointStyle: true, boxWidth: 10, color: '#94a3b8' },
      },
    },
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Outros'],
    datasets: [
      {
        data: [300, 150, 100, 80, 50],
        backgroundColor: [
          '#263b63',
          '#3b82f6',
          '#60a5fa',
          '#93c5fd',
          '#cbd5e1',
        ],
        hoverBackgroundColor: [
          '#1e2f4f',
          '#2563eb',
          '#3b82f6',
          '#60a5fa',
          '#94a3b8',
        ],
        borderWidth: 0,
      },
    ],
  };
  public pieChartType: ChartType = 'pie';

  constructor() {
    this.loadBillsFromLocalStorage();
  }

  setViewMode(mode: 'charts' | 'topics'): void {
    this.viewMode = mode;
  }

  loadBillsFromLocalStorage(): void {
    const storedBills = localStorage.getItem('bills');
    if (storedBills) {
      this.bills = JSON.parse(storedBills);
    }
  }

  onFileUploaded(file: File): void {
    console.log('Arquivo recebido:', file.name);
    setTimeout(() => {
      this.showAnalysis = true;
      this.pendingBill = {
        id: Date.now(),
        date: new Date().toLocaleDateString('pt-BR'),
        category: 'Fatura Importada',
        amount: 1245.5,
        status: 'Processada',
      };
    }, 800);
  }

  confirmInvoiceToHistory(): void {
    if (this.pendingBill) {
      this.bills = [this.pendingBill, ...this.bills];
      localStorage.setItem('bills', JSON.stringify(this.bills));
      this.pendingBill = null;
      this.showAnalysis = false;
    }
  }

  openDeleteModal(index: number): void {
    this.itemToDeleteIndex = index;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.itemToDeleteIndex = null;
  }

  confirmDelete(): void {
    if (this.itemToDeleteIndex !== null) {
      this.bills.splice(this.itemToDeleteIndex, 1);
      localStorage.setItem('bills', JSON.stringify(this.bills));
      this.closeDeleteModal();
    }
  }

  openClearModal(): void {
    this.showClearModal = true;
  }

  closeClearModal(): void {
    this.showClearModal = false;
  }

  confirmClearAll(): void {
    this.bills = [];
    localStorage.removeItem('bills');
    this.closeClearModal();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Processada':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900';
      case 'Erro':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  }
}
