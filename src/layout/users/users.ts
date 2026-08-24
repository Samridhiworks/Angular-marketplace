import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Api } from '../../services/api';
import { MatDialog } from '@angular/material/dialog';
import { AddUser } from './add-user/add-user';
import Swal from 'sweetalert2';


interface TeamMember {
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  avatarClass: string;
}

@Component({
  selector: 'app-users',
  imports: [MatButtonModule, MatTableModule,MatPaginatorModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','action'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  

  constructor(private api:Api,private dialog:MatDialog){}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  usersList:any[]=[];

  ngOnInit(){
    this.getUsers();

    

  }

  getUsers(){
    this.api.get('/users').subscribe({
      next:(res:any)=>{
        console.log('users data api:::',res)
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

 addUser(){
  this.dialog.open(AddUser,{
    width:'700px'
  })
 }

 editUser(user:any){
  const dialogRef= this.dialog.open(AddUser,{
    width:'700px',
    data:user
  })

  dialogRef.afterClosed().subscribe((updated)=>{
      if(updated){
        this.getUsers();
      }
    })
 }

 deleteUser(user:any){
     Swal.fire({
      title: 'Are you sure?',
    text: 'This department will be permanently deleted',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel'
    }).then((result)=>{
      if(result.isConfirmed){
        this.api.delete(`/users/${user.id}`).subscribe({
          next:(res:any)=>{
            console.log('User Deleted Successfully!!!')
          }
        })
      }
    })
 }

}




