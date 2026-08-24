import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Api } from '../../services/api';
import { MatDialog } from '@angular/material/dialog';
import { ResetPassword } from '../reset-password/reset-password';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [MatFormFieldModule, CommonModule, ReactiveFormsModule, MatInputModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {

  forgotForm!:FormGroup;
  private resetToken = '';

  constructor(private api:Api,private dialog:MatDialog){}

  ngOnInit(){
    this.forgotEmail()
  }

  forgotEmail(){
     this.forgotForm = new FormGroup({
      email: new FormControl('',Validators.required)
     })
  }

  onSubmit(){
   
    const payload = this.forgotForm.value;
    this.api.post('/auth/forgot-password',payload).subscribe({
      next:(res:any)=>{
        console.log('forgot res::',res)
        const responseData = res?.data?.data ?? res?.data ?? res;
        this.resetToken = responseData?.token ?? responseData?.resetToken ?? '';

        if (this.resetToken) {
          sessionStorage.setItem('passwordResetToken', this.resetToken);
          this.resetPassword();
        } else {
          window.alert('Reset token was not returned by the API. Please use the reset link sent to your email.');
        }
      }
    })
    
  }

  resetPassword(){
    if (!this.resetToken) {
      this.resetToken = sessionStorage.getItem('passwordResetToken') ?? '';
    }

    if (!this.resetToken) {
      window.alert('Send the reset link first, then use the link sent to your email.');
      return;
    }

    this.dialog.open(ResetPassword,{
      width:'700px',
      data: { token: this.resetToken }
    })
  }
}
