import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private apiUrl = 'http://localhost:5186'; // Replace with your API endpoint
  private apiUrl2 = 'http://localhost:5188';
  private apiUrlassociation = 'https://localhost:5041';
  constructor(private http: HttpClient) {}
  getAssociatedProjects(id: number) {
    return this.http.get(`${this.apiUrlassociation}/api/Association/colaborator/${id}`);
  }

  // Example GET request
  getItems() {
    return this.http.get(`${this.apiUrl}/api/Colaborator`);
  }
  // Example POST request
  createItem(item: any) {
    return this.http.post(`${this.apiUrl2}/api/Colaborator`, item);
  }

}
