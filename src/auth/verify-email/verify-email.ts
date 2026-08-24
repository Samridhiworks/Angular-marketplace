import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Api } from '../../services/api';
import { Router } from '@angular/router';

interface VerifyEmailDialogData {
  email: string;
}


@Component({
  selector: 'app-verify-email',
  imports: [ReactiveFormsModule,MatFormFieldModule,MatInputModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmail {

 otpForm !:FormGroup;
 isSubmitting = false;
 isSendingOtp = false;
 otpMessage = '';
 errorMessage = '';

  constructor(
    private api: Api,
    private dialogRef: MatDialogRef<VerifyEmail>,
    private router:Router,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: VerifyEmailDialogData | null,
  ) {}

  ngOnInit(){
    this.submitForm();
    this.sendOtp();
 }

 submitForm(){
  this.otpForm =  new FormGroup({
    email: new FormControl(this.data?.email ?? '', [Validators.required, Validators.email]),
    otp:new FormControl('',[Validators.required])
  })
 }

  onSubmit(){
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    const payload = {
      email: this.otpForm.controls['email'].value?.trim() ?? '',
      otp: this.otpForm.controls['otp'].value?.trim() ?? '',
    };

    this.api.post('/auth/email/verify-otp', payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        
        window.alert('Thank you! Your email has been verified successfully.');
        this.dialogRef.close(true);
        this.router.navigate(['/login'])
        

      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Unable to verify the OTP. Please try again.';
      },
    });
  }

  sendOtp(){
    const email = this.otpForm.controls['email'].value?.trim() ?? '';
    if (!email) {
      return;
    }

    this.isSendingOtp = true;
    this.otpMessage = '';
    this.errorMessage = '';
    this.api.post('/auth/email/send-otp', { email }).subscribe({
      next: () => {
        this.isSendingOtp = false;
        this.otpMessage = 'A new verification code has been sent to your email.';
      },
      error: (error: HttpErrorResponse) => {
        this.isSendingOtp = false;
        this.errorMessage = error.error?.message || 'Unable to send a verification code. Please try again.';
      },
    });
  }


}
