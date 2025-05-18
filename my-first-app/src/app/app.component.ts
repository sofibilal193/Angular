import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './Services/Auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { UserListComponent } from './components/auth/user/user-list/user-list.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterModule, UserListComponent, NgIf],
})
export class AppComponent {
  title = 'my-first-app';

  private authService = inject(AuthService);
  private router = inject(Router);

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}
