import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Api } from '../../services/api';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AddPermission } from './add-permission/add-permission';



interface TeamMember {
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  avatarClass: string;
}




@Component({
  selector: 'app-permission',
  imports: [MatButtonModule, MatTableModule,MatPaginatorModule],
  templateUrl: './permission.html',
  styleUrl: './permission.css',
})
export class Permission {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','action'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  

  constructor(private api:Api,private dialog:MatDialog){}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  permissionList:any[]=[];

  ngOnInit(){
    this.getPermission();

    

  }

  getPermission(){
    this.api.get('/permissions').subscribe({
      next:(res:any)=>{
        console.log('roles data api:::',res.data)
        this.permissionList = res.data;
        this.dataSource = new MatTableDataSource(this.permissionList);
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

 addPermission(){
  this.dialog.open(AddPermission,{
    width:'700px'
  })
 }

 EditPermssion(permit:any){
  const dialogRef= this.dialog.open(AddPermission,{
    width:'700px',
    data:permit
  })

  dialogRef.afterClosed().subscribe((updated)=>{
      if(updated){
        this.getPermission();
      }
    })
 }

 deletePermission(permit:any){
     Swal.fire({
      title: 'Are you sure?',
    text: 'Want to delete this Permission?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel'
    }).then((result)=>{
      if(result.isConfirmed){
        this.api.delete(`/permissions/${permit.id}`).subscribe({
          next:(res:any)=>{
            console.log('Permission Deleted Successfully!!!')
          }
        })
      }
    })
 }

}





