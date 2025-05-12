// src/app/shared/loader/loader.component.ts
import { Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { LoaderService } from '../../Services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  template: `
    <div *ngIf="loading$ | async" class="loader-overlay">
      <div class="spinner"></div>
    </div>
  `,
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent {
  loading$;

  constructor(private loaderService: LoaderService) {
    this.loading$ = this.loaderService.loading$;
  }
}
