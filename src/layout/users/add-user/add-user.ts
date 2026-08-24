import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {  MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatAnchor } from "@angular/material/button";
import { Api } from '../../../services/api';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-user',
  imports: [MatFormFieldModule, CommonModule, MatInputModule, ReactiveFormsModule, MatAnchor],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
})
export class AddUser {

  addUser!:FormGroup;


  constructor(private api:Api,private dialogRef:MatDialogRef<AddUser>,
    @Inject (MAT_DIALOG_DATA) public user:any
  ){}

  ngOnInit(){
    this.useraddForm();

    if(this.user){
      this.addUser.patchValue({
        fullName: this.user.fullName,
        email: this.user.email,
        phone:this.user.phone,
        password:this.user.password
      })
    }
  }

  useraddForm(){
    this.addUser = new FormGroup({
      fullName : new FormControl('',Validators.required),
      email : new FormControl('',Validators.required),
      phone : new FormControl('',Validators.required),
      password : new FormControl('',Validators.required),
      // role:new FormControl('',Validators.required),
      // status:new FormControl('',Validators.required)
    })
  }

  onSubmit(){
    const payload = this.addUser.value
 
    if(this.user.invalid){
      this.addUser.markAllAsTouched();
      return;
    }

  if(this.user){
    this.api.patch( `/users/${this.user.id}`,payload).subscribe({
      next:(res:any)=>{
        console.log('user edit value:::',res)
        this.dialogRef.close();
        alert('User updated Successfully!!!')
        
        
      },
      error:(err:any)=>{
        console.log('user edit value error:::',err)
      }
    })
    return;
  }

   this.api.post('/users',payload).subscribe({
    next:(res:any)=>{
      console.log('user added:::',res);
      this.addUser.reset()
      alert('User added Successfully !!!');
      this.dialogRef.afterClosed()
    
    },
    error:(err:any)=>{
      console.log('error',err)
    }
  })
  }
}
