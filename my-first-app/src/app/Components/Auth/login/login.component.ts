import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../Services/Auth/auth.service';
import { Router } from '@angular/router';
import { LoginModel } from '../../../models/login';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from '../../../Services/local-storage.service';
import { ToastrService } from 'ngx-toastr';

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
  userId: number = 0;
  showForgotPasswordPopup = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private toastr: ToastrService
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
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly';
      this.toastr.warning('Invalid form data', 'Warning');
      return;
    }

    const { email, password, rememberMe } = this.loginForm.value;
    const formValue: LoginModel = { email, password, rememberMe };

    this.authService.loginUserAsync(formValue).subscribe({
      next: (response) => {
        const token = response?.data?.token;

        if (token) {
          this.localStorageService.setAuthToken(token);
          this.toastr.success('Login successful!', 'Welcome');
          this.authService.loggedInUser.isLoggedIn = true;
          this.router.navigate(['/']);
        } else {
          this.errorMessage = 'Invalid response from server.';
          this.toastr.error('Login Failed!', 'Error');
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'Login failed. Please try again.';
        this.toastr.error('Login Failed!', 'Error');
      },
    });
  }

  openForgotPasswordPopup() {
    this.showForgotPasswordPopup = true;
  }

  closeForgotPasswordPopup() {
    this.showForgotPasswordPopup = false;
  }
}
