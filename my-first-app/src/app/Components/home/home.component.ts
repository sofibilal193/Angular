import { Component, inject } from '@angular/core';
import { AuthService } from '../../Services/Auth/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { UserListComponent } from '../auth/user/user-list/user-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [UserListComponent, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private authService = inject(AuthService);
  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}
