import { Injectable } from '@angular/core';
import { environments } from '../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class Api {
  
  private baseUrl = environments.apiUrl;

  constructor(private http:HttpClient){}

  get(url: string ) {
    return this.http.get(`${this.baseUrl}/api/v1${url}` );
  }

  post(url: string, data:any) {
    return this.http.post(`${this.baseUrl}/api/v1${url}`, data);
  }

   patch(url: string, data:any) {
    return this.http.patch(`${this.baseUrl}/api/v1${url}`, data);
  }

    delete(url: string,) {
    return this.http.delete(`${this.baseUrl}/api/v1${url}` );
  }
  
}
