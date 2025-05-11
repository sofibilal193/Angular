import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { LoginModel } from '../../../models/login';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from '../../../Services/local-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    // Define the form group with all necessary form controls and validations
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [true || false],
    });
  }

  ngOnInit(): void {}

  // Form submission
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.value;
      const formValue: LoginModel = {
        email,
        password,
        rememberMe,
      };
      debugger;

      var token = this.localStorageService.getAuthToken();

      if (token) {
          var userId =  this.authService.userDetailFromToken().userId;
          var user =  this.authService.GetUserAsync(userId);
      }

      this.authService.login(formValue).subscribe(
        (response) => {
          this.localStorageService.setAuthToken(
            response.data.token
          );
          console.log('Registration successful', response);
          // this.router.navigate(['/login']);
        },
        (error) => {
          this.errorMessage = 'Registration failed. Please try again.';
          console.error('Registration failed', error);
        }
      );
    } else {
      this.errorMessage = 'Please fill in all fields correctly';
    }
  }
}
