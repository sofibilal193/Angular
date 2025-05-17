import { Component, inject, OnInit } from '@angular/core';
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
    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.value;
      const formValue: LoginModel = {
        email,
        password,
        rememberMe,
      };

      const token = this.localStorageService.getAuthToken();

      if (token) {
        const userDetails = this.authService.userDetailFromToken();
        this.userId = userDetails?.userId ?? 0;
      }
      debugger;

      if (this.userId != 0 && !isNaN(this.userId)) {
        this.authService.GetUserAsync(this.userId).subscribe({
          next: (userResponse) => {
            this.localStorageService.setUser(userResponse);
            this.toastr.success(
              `Login successful!`,
              `Welcome ${userResponse.firstName}`
            );
          },
          error: () => {
            this.toastr.error('Failed to retrieve user data.', 'Error');
          },
        });
      } else {
        this.authService.login(formValue).subscribe({
          next: (response) => {
            this.localStorageService.setAuthToken(response.data.token);
            this.toastr.success('Login successful!', 'Welcome');

            // Immediately extract user info from the token and fetch user data
            const newUserId = this.authService.userDetailFromToken()?.userId;
            if (newUserId != null && !isNaN(newUserId)) {
              this.authService.GetUserAsync(newUserId).subscribe({
                next: (userResponse) => {
                  this.localStorageService.setUser(userResponse);
                  this.toastr.success(
                    `User data loaded!`,
                    `Welcome ${userResponse.firstName}`
                  );
                },
                error: () => {
                  this.toastr.error('Could not load user data.', 'Warning');
                },
              });
            }
          },
          error: (error) => {
            this.errorMessage = 'Login failed. Please try again.';
            this.toastr.error('Login Failed!', 'Error');
          },
        });
      }
    } else {
      this.errorMessage = 'Please fill in all fields correctly';
      this.toastr.warning('Invalid form data', 'Warning');
    }
  }
}
