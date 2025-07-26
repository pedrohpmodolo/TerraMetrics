import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

// Custom validator function to check if passwords match
export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordsMismatch: true };
  }

  return null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordsMatchValidator }); // Apply the custom validator to the whole form
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      // Check if the specific error is the password mismatch
      if (this.registerForm.errors?.['passwordsMismatch']) {
        this.errorMessage = 'Passwords do not match.';
      }
      return;
    }

    this.errorMessage = null;
    // --- UPDATED: Get firstName from the form value ---
    const { firstName, email, password } = this.registerForm.value;

    // --- UPDATED: Pass the firstName to the signUp method ---
    this.authService.signUp(firstName, email, password)
      .then(() => {
        // On successful registration, navigate to the home page (globe)
        this.router.navigate(['/']);
      })
      .catch(error => {
        // On failure, display an error message
        if (error.code === 'auth/email-already-in-use') {
          this.errorMessage = 'This email address is already in use.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
        console.error('Registration error:', error);
      });
  }
}
