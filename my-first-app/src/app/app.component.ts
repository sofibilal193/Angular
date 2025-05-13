import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './Services/auth.service';
import { LoaderComponent } from './components/loader/loader.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { UserListComponent } from './components/auth/user/user-list/user-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    LoginComponent,
    RegisterComponent,
    LoaderComponent,
    UserListComponent,
  ],
})
export class AppComponent implements OnInit {
  title = 'my-first-app';
  isLoggedIn = false;

  private authService = inject(AuthService);

  async ngOnInit(): Promise<void> {
    // this.authService.autoLogin().subscribe(user => {
    //   this.isLoggedIn = !!user;
    // });
  }
}
