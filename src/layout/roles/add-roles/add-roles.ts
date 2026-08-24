import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {  MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatAnchor } from "@angular/material/button";
import { Api } from '../../../services/api';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogClose } from '@angular/material/dialog';



@Component({
  selector: 'app-add-roles',
   imports: [MatFormFieldModule, CommonModule, MatInputModule, ReactiveFormsModule, MatAnchor, MatDialogClose],
  templateUrl: './add-roles.html',
  styleUrl: './add-roles.css',
})
export class AddRoles {

  addRoles!:FormGroup;


  constructor(private api:Api,private dialogRef:MatDialogRef<AddRoles>,
    @Inject (MAT_DIALOG_DATA) public role:any
  ){}

  ngOnInit(){
    this.addRole();

    if(this.role){
      this.addRoles.patchValue({
        name: this.role.name,
        description: this.role.description,
        slug:this.role.slug,
        level:this.role.level
      })
    }
  }

  addRole(){
    this.addRoles = new FormGroup({
      name : new FormControl('',Validators.required),
      description : new FormControl('',Validators.required),
      slug : new FormControl('',Validators.required),
      level : new FormControl('',Validators.required),
      // role:new FormControl('',Validators.required),
      // status:new FormControl('',Validators.required)
    })
  }

  onSubmit(){
    const payload = this.addRoles.value

    if(this.role){
      this.api.patch(`/roles/${this.role.id}`,payload).subscribe({
    next:(res:any)=>{
      console.log('role updated:::',res);
      this.addRoles.reset()
      alert('Role updated Successfully !!!');
      this.dialogRef.afterClosed()
    
    },
    error:(err:any)=>{
      console.log('error',err)
    }
  })
  return;
    }

   this.api.post('/roles',payload).subscribe({
    next:(res:any)=>{
      console.log('role added:::',res);
      this.addRoles.reset()
      alert('Role added Successfully !!!');
      this.dialogRef.afterClosed()
    
    },
    error:(err:any)=>{
      console.log('error',err)
    }
  })
  }
}

