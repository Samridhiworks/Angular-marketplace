import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "../shared/sidebar/sidebar";
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { CommonModule } from '@angular/common';
import { Header } from "../shared/header/header";

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar, CommonModule, Header],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
 constructor( public sidebarservice: SidebarService ) {

    }
        


      toggleSidebar() {
        this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
    }
   
    getSideBarState() {
        return this.sidebarservice.getSidebarState();
    }

    ngOnInit() {
       
    }
}
