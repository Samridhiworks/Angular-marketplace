import { Component } from '@angular/core';
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatInput, MatInputModule } from "@angular/material/input";
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { Api } from '../../services/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {

  resetForm!:FormGroup;
  token:string =''

  constructor(private api:Api,private route:ActivatedRoute,private router:Router){}

  ngOnInit(){
   

    this.route.queryParams.subscribe(params=>{
      this.token=params['token']||'';
    })

     this.resetDetails();
  }
  resetDetails(){
    this.resetForm = new FormGroup({
      
       otp:new FormControl('',Validators.required) ,
     password:new FormControl('',Validators.required) ,
     confirmPassword:new FormControl('',Validators.required)
    })
  }

  onSubmit(){
    
   
   const payload = {
      token: String(this.token),
      otp: String(this.resetForm.value.otp),
      password: this.resetForm.value.password,
      confirmPassword: this.resetForm.value.confirmPassword
    };
    console.log('Sending Payload:', payload);
    
    this.api.post('/auth/reset-password',payload).subscribe({
      next:(res:any)=>{
        console.log('resetForm:::',res);
        this.router.navigate(['/admin/dashboard'])
        
      }
    })
  }
}
