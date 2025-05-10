import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../Services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Define RegisterModel interface
export interface RegisterModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;  
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,HttpClientModule ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Define the form group with all necessary form controls and validations
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // Password match validation
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Form submission
 onSubmit(): void {
  if (this.registerForm.valid) {
    const { firstName, lastName, email, password } = this.registerForm.value;
    const formValue: RegisterModel = {
      firstName, lastName, email, password,
      confirmPassword: ''
    };
    this.onRegister(formValue);
  } else {
    this.errorMessage = 'Please fill in all fields correctly';
  }
}

  // Register method that calls the AuthService
  onRegister(formValue: RegisterModel): void {
    // Call the register method from AuthService
    this.authService.register(formValue).subscribe(
      (response) => {
        // Registration success
        console.log('Registration successful', response);
        this.router.navigate(['/login']); // Navigate to login page after successful registration
      },
      (error) => {
        // Handle registration error
        this.errorMessage = 'Registration failed. Please try again.';
        console.error('Registration failed', error);
      }
    );
  }
}
