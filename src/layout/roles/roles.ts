import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Api } from '../../services/api';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AddRoles } from './add-roles/add-roles';
import { ManagePermission } from './manage-permission/manage-permission';


interface TeamMember {
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  avatarClass: string;
}



@Component({
  selector: 'app-roles',
   imports: [MatButtonModule, MatTableModule,MatPaginatorModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','action'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  

  constructor(private api:Api,private dialog:MatDialog){}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  usersList:any[]=[];

  ngOnInit(){
    this.getRoles();

    

  }

  getRoles(){
    this.api.get('/roles').subscribe({
      next:(res:any)=>{
        console.log('roles data api:::',res.data)
        this.usersList = res.data;
        this.dataSource = new MatTableDataSource(this.usersList);
        this.dataSource.paginator = this.paginator;
      }
    })
  }


 applyFilter(event:Event){
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  this.dataSource.filter = filterValue;


   if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage() ;
    }
 }

 addRole(){
  this.dialog.open(AddRoles,{
    width:'700px'
  })
 }

 editRole(role:any){
  const dialogRef= this.dialog.open(AddRoles,{
    width:'700px',
    data:role
  })

  dialogRef.afterClosed().subscribe((updated)=>{
      if(updated){
        this.getRoles();
      }
    })
 }

 deleteRole(role:any){
     Swal.fire({
      title: 'Are you sure?',
    text: 'Want to delete this Role?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel'
    }).then((result)=>{
      if(result.isConfirmed){
        this.api.delete(`/roles/${role.id}`).subscribe({
          next:(res:any)=>{
            console.log('Roles Deleted Successfully!!!')
          }
        })
      }
    })
 }

 openPermission(role:any){
  const dialogRef = this.dialog.open(ManagePermission,{
    width:'900px',
    data:{
      roleId : role.id,
       roleName: role.name
    }
  })

     dialogRef.afterClosed().subscribe(result => {

      if (result) {
        console.log('Permissions updated');
      }

    });
 }

}





