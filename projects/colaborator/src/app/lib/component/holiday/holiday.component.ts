import { Component, Input, SimpleChanges } from '@angular/core';
import { Holiday } from '../../model/holiday';
import { HolidayService } from '../../service/holiday.service';
import { Router, RouterLink } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';
import { HolidayAddComponent } from './holiday-add/holiday-add.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-holiday',
  standalone: true,
  templateUrl: './holiday.component.html',
  styleUrl: './holiday.component.css',
  imports: [RouterLink, CommonModule, HolidayAddComponent, FormsModule],
})
export class HolidayComponent {
  @Input() _colabId: any;
  @Input() _colabName: any;
  holidays: Holiday[] = [];
  filteredHolidays: Holiday[] = [];
  colaboratorsMap: Map<number, string> = new Map();
  showAddHolidayForm: boolean = false;
  startDate: string = '';
  endDate: string = '';

  constructor(
    private holidayService: HolidayService,
    private router: Router,
    private toast: NgToastService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['_colabId'] && changes['_colabId'].currentValue) {
      this.getHolidayFromColab(changes['_colabId'].currentValue);
    }
  }

  getHolidayFromColab(colabId: number) {
    this.holidayService.getHolidays().subscribe((holidays) => {
      this.holidays = holidays.filter(
        (holiday) => holiday._colabId === colabId
      );
      this.filteredHolidays = this.holidays;
    });
  }

  getHolidays() {
    this.holidayService.getHolidays().subscribe((holidays) => {
      this.holidays = holidays;
      this.filteredHolidays = this.holidays;
    });
  }

  getRouterLink(nDays: string) {
    if (nDays) {
      this.router.navigate(['/Holiday/colaborator', nDays]);
    }
  }

  onHolidayAdded(newHoliday: Holiday): void {
    this.hideAddHolidayPopup();
    this.filteredHolidays.push(newHoliday);
  }

  hideAddHolidayPopup() {
    this.showAddHolidayForm = false;
  }

  filterHolidays() {
    if (this.startDate && this.endDate) {
      this.filteredHolidays = this.holidays.filter(
        (holiday) =>
          new Date(holiday._holidayPeriod.startDate) >=
            new Date(this.startDate) &&
          new Date(holiday._holidayPeriod.endDate) <= new Date(this.endDate)
      );
    } else {
      this.filteredHolidays = this.holidays;
    }
  }
}
