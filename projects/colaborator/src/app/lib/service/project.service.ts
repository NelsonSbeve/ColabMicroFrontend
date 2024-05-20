import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrlprojeto = 'https://localhost:7285';
  private apiUrlprojeto2 = 'https://localhost:7283';

  constructor(private http: HttpClient) {}

  getItemsProjeto(id: number) {
    return this.http.get(`${this.apiUrlprojeto2}/api/Project/${id}`);
  }
  createItemProjeto(item: any) {
    return this.http.post(`${this.apiUrlprojeto}/api/Project`, item);
  }
}
