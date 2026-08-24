import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Api } from '../../../services/api';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-permission',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, CommonModule, MatDialogClose],
  templateUrl: './add-permission.html',
  styleUrl: './add-permission.css',
})
export class AddPermission {

  permissionForm!:FormGroup;
  modulesList:string[]=[];

  constructor(private api:Api,
    @Inject (MAT_DIALOG_DATA) public permit:any,
    private cdr:ChangeDetectorRef
  ){}

  ngOnInit(){
    this.permitForm();

    this.getModules();

    if(this.permit){
      this.permissionForm.patchValue({
        name:this.permit.name,
        module:this.permit.module,
        slug:this.permit.slug
      })
    }
  }

  permitForm(){
    this.permissionForm = new FormGroup({
      module : new FormControl('',Validators.required),
      name :new FormControl('',Validators.required),
      slug:new FormControl('',Validators.required)
    })
  }

  onSubmit(){

    const payload= this.permissionForm.value;

    if(this.permit){
        this.api.patch(`/permissions/${this.permit.id}`,payload).subscribe({
      next:(res:any)=>{
        console.log('permission updated::',res)
        alert('Permission Updated Successfully!!')
      },
      error:(err:any)=>{
        console.log('error',err)
      }
    })
    return;
    }

    this.api.post('/permissions',payload).subscribe({
      next:(res:any)=>{
        console.log('permission added::',res)
        alert('Permission Addedd Successfully!!')
      },
      error:(err:any)=>{
        console.log('error',err)
      }
    })
    
  }

  getModules(){
    this.api.get('/permissions/modules').subscribe({
      next:(res:any)=>{
        console.log('modules api',res.data)
          this.modulesList = res.data.map(
        (item: any) => item.module
      );
      this.cdr.detectChanges();
      },
      error:(err:any)=>{
        console.log('error',err)
      }
    })
  }

}
