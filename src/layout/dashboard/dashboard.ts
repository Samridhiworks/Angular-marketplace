import { Component, signal } from '@angular/core';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  dashboardList = signal<any>(null);

  constructor(private api: Api) {}

  ngOnInit() {
    this.getData();
    this.getAnalytics()
  }

  getData() {
    this.api.get('/admin/dashboard').subscribe({
      next: (res: any) => {
        console.log('API RESPONSE:', res);
        console.log('DASHBOARD DATA:', res.data);

        this.dashboardList.set(res.data);
      },
      error: (err) => {
        console.error('Dashboard API error:', err);
      }
    });
  }

   getAnalytics() {
    this.api.get('/admin/orders').subscribe({
      next: (res: any) => {
        console.log('API RESPONSE:', res);
        console.log('ANALYTICS DATA:', res.data);

        this.dashboardList.set(res.data);
      },
      error: (err) => {
        console.error('Dashboard API error:', err);
      }
    });
  }

  
}
