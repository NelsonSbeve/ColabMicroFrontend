import { Component } from '@angular/core';
import { HolidayService } from '../../../service/holiday.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ColaboratorService } from '../../../service/colaborator.service';
import { Colaborator } from '../../../model/colaborator';

@Component({
  selector: 'app-colabs-more-than-xdays',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './colabs-more-than-xdays.component.html',
  styleUrl: './colabs-more-than-xdays.component.css'
})
export class ColabsMoreThanXDaysComponent {
  nDays!: number;
  colaboratorsMap: Map<number, string> = new Map();
  colaboratorsXDays: Colaborator[] = [];

  constructor (private holidayService: HolidayService, private colaboratorService: ColaboratorService, private route: ActivatedRoute){}

  ngOnInit() {
    this.nDays = parseInt(this.route.snapshot.paramMap.get('nDays')!);
    this.getColaboratorXDays();

    this.colaboratorService.getColaborators().subscribe();
    this.colaboratorsMap = this.colaboratorService.colaboratorsMap;
  }

  getColaboratorXDays(){
    this.holidayService.getColaboratorsXDays(this.nDays).subscribe(ids => {
      this.colaboratorsXDays = ids.map(id => ({
        id: id,
        name: this.colaboratorsMap.get(id)!
      }));
    });
  }
}
