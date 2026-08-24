import { Component } from '@angular/core';
import { SidebarService } from '../sidebar/sidebar.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-header',
  imports: [MatIconModule,MatMenuModule,MatDividerModule,CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
 constructor( public sidebarservice: SidebarService, private router: Router) {

  }


  

  theme_name = 'dark_mode'

  toggleSearch: boolean = false;
 

  getSideBarSate() {
    return this.sidebarservice.getSidebarState();
  }

logout() {
  Swal.fire({
    icon: 'success',
    text: 'Logout successfully',
    timer: 1500,
    showConfirmButton: false
  }).then(() => {
   
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/']);
  });
}

  

  toggleSidebar() {
    this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
  }

  openSearch() {
    this.toggleSearch = true;
  }

  searchClose() {
    this.toggleSearch = false;
  }


  appIcon: any[] = [
    { src: 'assets/images/app/apple.png', name: 'Apple' },
    { src: 'assets/images/app/behance.png', name: 'Behance' },
    { src: 'assets/images/app/slack.png', name: 'Slack' },
    { src: 'assets/images/app/bootstrap.png', name: 'Bootstrap' },
    { src: 'assets/images/app/google-drive.png', name: 'Drive' },
    { src: 'assets/images/app/outlook.png', name: 'Outlook' },
    { src: 'assets/images/app/github.png', name: 'GitHub' },
    { src: 'assets/images/app/stack-overflow.png', name: 'Overflow' },
    { src: 'assets/images/app/figma.png', name: 'Figma' },
    { src: 'assets/images/app/twitter.png', name: 'Twitter' },
    { src: 'assets/images/app/google-calendar.png', name: 'Calendar' },
    { src: 'assets/images/app/spotify.png', name: 'Spotify' },
    { src: 'assets/images/app/google-photos.png', name: 'Photos' },
    { src: 'assets/images/app/pinterest.png', name: 'Pinterest' },
    { src: 'assets/images/app/linkedin.png', name: 'linkedin' },
    { src: 'assets/images/app/dribble.png', name: 'Dribbble' },
    { src: 'assets/images/app/youtube.png', name: 'YouTube' },
    { src: 'assets/images/app/google.png', name: 'News' },
    { src: 'assets/images/app/envato.png', name: 'Envato' },
    { src: 'assets/images/app/safari.png', name: 'Safari' },


  ];


  ngOnInit() {
  

  }

}
