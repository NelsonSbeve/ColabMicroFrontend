import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Holiday } from '../model/holiday';
import { HolidayPeriod } from '../model/holidayPeriod';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  holidayQUrl = "https://localhost:5101/api/Holiday";
  holidayCUrl = "https://localhost:5091/api/Holiday";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getHolidays(): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(this.holidayQUrl)
      .pipe(
        catchError(this.handleError<Holiday[]>())
      );
  }

  getHolidaysInPeriod(id: number, startDate: string, endDate: string): Observable<HolidayPeriod[]> {
    const url = `${this.holidayQUrl}/periods/${id}?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<HolidayPeriod[]>(url)
      .pipe(
        catchError(this.handleError<HolidayPeriod[]>())
      );
  }

  getColaboratorsXDays(xDays: number){
    const url = `${this.holidayQUrl}/${xDays}/colabsComFeriasSuperioresAXDias`;
    return this.http.get<number[]>(url)
      .pipe(
        catchError(this.handleError<number[]>())
      );
  }

  addHoliday(holi: Holiday): Observable<Holiday> {
    return this.http.post<Holiday>(this.holidayCUrl, holi, this.httpOptions).pipe(
      catchError(this.handleError<Holiday>())
    );
  }

  private handleError<T>() {
    return (error: any): Observable<T> => {
      console.error(error); 
      throw error;
    };
  }
}
