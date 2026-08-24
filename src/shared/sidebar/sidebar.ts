import { Component } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [MatIconModule,MatListModule,MatExpansionModule,CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor(public sidebarservice: SidebarService
    ) { }

    getSideBarSate() {
        return this.sidebarservice.getSidebarState();
    }

    ngOnInit() {
    }

}
