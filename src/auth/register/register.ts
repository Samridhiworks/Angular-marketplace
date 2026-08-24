import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../../services/api';
import { MatDialog } from '@angular/material/dialog';
import { VerifyEmail } from '../verify-email/verify-email';

@Component({
  selector: 'app-register',
  imports: [MatFormField, MatInputModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm!: FormGroup;

  constructor(
    private api: Api,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.registerForm = new FormGroup({
      fullName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      countryId: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    const payload = this.registerForm.value;

    this.api.post('/auth/register', payload).subscribe({
      next: (res: any) => {
        console.log('register', res);
        const email = this.registerForm.controls['email'].value?.trim() ?? '';
        this.registerForm.reset({
          fullName: '',
          email: '',
          password: '',
          phone: '',
          countryId: '',
        });

        this.dialog.open(VerifyEmail, {
          width: '700px',
          data: { email },
        });
      },
    });
  }
}
