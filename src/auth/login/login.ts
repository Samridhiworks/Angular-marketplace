import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../../services/api';
import { MatDialog } from '@angular/material/dialog';
import { VerifyEmail } from '../verify-email/verify-email';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(
    private api: Api,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    const payload = this.loginForm.getRawValue();
    this.api.post('/auth/login', payload).subscribe({
      next: (res: any) => {
        const tokens = res?.data?.data?.tokens;
        console.log('login-res', tokens?.accessToken);
        this.isSubmitting = false;

        if (tokens?.accessToken) {
          sessionStorage.setItem('accessToken', tokens.accessToken);
        }
        if (tokens?.refreshToken) {
          sessionStorage.setItem('refreshToken', tokens.refreshToken);
        }

        sessionStorage.setItem('formData', JSON.stringify(res.data.data));
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        if (error.error?.code === 'EMAIL_NOT_VERIFIED') {
          setTimeout(() => {
            const verifyDialog = this.dialog.open(VerifyEmail, {
              width: '480px',
              data: { email: payload.email },
            });

            verifyDialog.afterClosed().subscribe((emailVerified) => {
              if (emailVerified) {
                this.onSubmit();
              }
            });
          });
          return;
        }

        this.errorMessage =
          error.status === 401
            ? 'Email or password is incorrect.'
            : error.error?.message || 'Login failed. Please try again.';
      },
    });
  }
}
