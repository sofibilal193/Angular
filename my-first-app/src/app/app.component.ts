import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './Services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { UserListComponent } from "./components/auth/user/user-list/user-list.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterModule, UserListComponent, NgIf],
})
export class AppComponent implements OnInit {
  title = 'my-first-app';

  private authService = inject(AuthService);
  private router = inject(Router);

  async ngOnInit(): Promise<void> {
    debugger

    this.authService.autoLogin().subscribe(user => {

      if (user === null) {
        this.authService.loggedInUser.isLoggedIn = false;
        this.router.navigate(['/login']);
      }
      else {
        this.authService.loggedInUser.isLoggedIn = true;
      }
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.loggedInUser?.isLoggedIn === true;
  }
}
