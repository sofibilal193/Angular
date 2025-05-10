import { Component, OnInit, inject } from '@angular/core';
import { RegisterComponent } from './Components/Auth/register/register.component';
import { LoginComponent } from './Components/Auth/login/login.component';
import { AuthService } from './Services/auth.service';
import { HomeComponent } from './Components/home/home.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [NgIf,LoginComponent, HomeComponent],
})
export class AppComponent implements OnInit {
  title = 'my-first-app';
  isLoggedIn = false;

  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.autoLogin().subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }
}
