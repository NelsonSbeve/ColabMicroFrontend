import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HolidayService } from '../../../service/holiday.service';
import { Holiday } from '../../../model/holiday';
import { HolidayPeriod } from '../../../model/holidayPeriod';
import { Router, RouterLink } from '@angular/router';
import { Colaborator } from '../../../model/colaborator';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { ColaboratorService } from '../../../service/colaborator.service';

@Component({
  selector: 'app-holiday-add',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './holiday-add.component.html',
  styleUrl: './holiday-add.component.css'
})
export class HolidayAddComponent {
  @Output() holidayAdded = new EventEmitter();
  @Input() _colabName: any;
  @Input() _colabId: any;

  colaborators: Colaborator[] = []

  constructor(
    private holidayService: HolidayService,
    private colaboratorService: ColaboratorService,
    private toast: NgToastService
  ) { }

  ngOnInit() {
    this.getColaborators();
  }

  getColaborators() {
    this.colaboratorService.getColaborators()
      .subscribe(colabs => this.colaborators = colabs);
  }

  add(colab: string, startDate: string, endDate: string) {
    let _colabId = parseInt(colab);
    let _holidayPeriod = { startDate, endDate } as HolidayPeriod;

    this.holidayService.addHoliday({ _colabId, _holidayPeriod } as Holiday)
      .subscribe({
        next: hol => {
          // Emitir evento de férias adicionadas
          this.holidayAdded.emit(hol);
          this.toast.info({ detail: "Holiday pendent", summary: 'Info', duration: 4000 });
        },
        error: err => {
          if (err instanceof HttpErrorResponse) {
            this.toast.error({ detail: err.error[0], summary: 'Error', duration: 5000 });
          } else {
            this.toast.error({ detail: 'An unexpected error occurred.', summary: 'Error', duration: 5000 });
          }
        }
      });
  }
}
