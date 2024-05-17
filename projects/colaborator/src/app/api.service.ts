import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private apiUrl = 'https://localhost:5001'; // Replace with your API endpoint
  private apiUrl2 = 'https://localhost:5011';
  private apiUrlprojeto = 'http://localhost:5188';
  private apiUrlprojeto2 = 'http://localhost:5186';
  private apiUrlassociation = 'http://localhost:5186';



  constructor(private http: HttpClient) {}


  getAssociatedProjects(id: any) {
    return this.http.get(`${this.apiUrl}/api/Association/Colaborator${id}`);
  }
  
  // Example GET request
  getItems() {
    return this.http.get(`${this.apiUrl}/api/Colaborator`);
  }
  // Example POST request
  createItem(item: any) {
    return this.http.post(`${this.apiUrl2}/api/Colaborator`, item);
  }
  getItemsProjeto(id: number) {
    return this.http.get(`${this.apiUrlprojeto2}/api/Project/${id}`);
  }
  createItemProjeto(item: any) {
    return this.http.post(`${this.apiUrlprojeto}/api/Project`, item);
  }
}
