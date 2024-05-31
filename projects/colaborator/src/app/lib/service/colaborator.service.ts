import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { Colaborator } from '../model/colaborator';

@Injectable({
  providedIn: 'root'
})
export class ColaboratorService {
  private colaboratorsQUrl = 'http://localhost:5186/api/Colaborator';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  colaboratorsMap: Map<number, string> = new Map();

  constructor(private http: HttpClient) { }


  getColaborators(): Observable<Colaborator[]> {
    return this.http.get<Colaborator[]>(this.colaboratorsQUrl)
      .pipe(
        map(colaborators => {
          colaborators.forEach(colab => this.colaboratorsMap.set(colab.id, colab.name));
          return colaborators;
        }),
        catchError(this.handleError<Colaborator[]>('getColaborators', []))
      );
  }

  getColaborator(id: number): Observable<Colaborator> {
    const url = `${this.colaboratorsQUrl}/${id}`;

    return this.http.get<Colaborator>(url).pipe(
      catchError(this.handleError<Colaborator>(`getColaborator id=${id}`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
