import { Component, Input, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, LogoComponent, LucideAngularModule],
  template: `
    <div
      class="min-h-screen w-full flex items-center justify-center p-6 md:p-8 bg-[#eff6ff] dark:bg-black transition-colors duration-300"
    >
      <div
        class="bg-white dark:bg-gray-900 w-full max-w-[500px] rounded-2xl p-8 md:p-10 shadow-2xl flex flex-col relative border border-transparent dark:border-gray-800 transition-colors duration-300"
      >
        <button
          (click)="goBack()"
          class="absolute top-6 left-6 text-slate-400 hover:text-[#263b63] dark:hover:text-white transition-colors cursor-pointer"
          title="Voltar"
        >
          <lucide-icon name="arrow-left" [size]="24"></lucide-icon>
        </button>

        <header class="flex flex-col items-center justify-center mb-6 mt-2">
          <app-logo [showText]="false" [large]="true"></app-logo>
        </header>

        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class AuthLayoutComponent {
  @Input() title = '';
  private location = inject(Location);

  goBack() {
    this.location.back();
  }
}
