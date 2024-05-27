import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { HolidayComponent } from './holiday.component';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('HolidayComponent', () => {
  let component: HolidayComponent;
  let fixture: ComponentFixture<HolidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolidayComponent, HttpClientModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: {get:(id:number)=>{id:1}}}}
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have add holiday button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button.add-holiday-btn')?.textContent).toContain('Add Holiday');
  });

  it('should set showAddHolidayForm to true and show form when Add Holiday button is clicked', () => {
    const button = fixture.nativeElement.querySelector('button.add-holiday-btn');
    
    expect(component.showAddHolidayForm).toBe(false);
    button.click();
    fixture.detectChanges();
    expect(component.showAddHolidayForm).toBe(true);

    const formDiv = fixture.nativeElement.querySelector('.add-holiday-form');
    expect(formDiv).toBeTruthy();
  });

  it('should set showAddHolidayForm to false and close form when close button is clicked', () => {
    component.showAddHolidayForm = true;
    fixture.detectChanges();

    let formDiv = fixture.nativeElement.querySelector('.add-holiday-form');
    const close = fixture.nativeElement.querySelector('.close');
    expect(formDiv).toBeTruthy();

    close.click();
    fixture.detectChanges();

    formDiv = fixture.nativeElement.querySelector('.add-holiday-form');
    expect(formDiv).toBeFalsy();
  });

  it('should render table headers', () => {
    const tableHeaderElements = fixture.nativeElement.querySelectorAll('th');
  
    expect(tableHeaderElements.length).toBe(2);
    expect(tableHeaderElements[0].textContent).toContain('Data de Início');
    expect(tableHeaderElements[1].textContent).toContain('Data de Fim');
  });

  it('should render table rows based on provided data', () => {
    component.filteredHolidays = [
      { id: 1, _colabId: 1, _colabName: 'John Doe', _holidayPeriod: { startDate: '2024-05-01', endDate: '2024-05-05' } },
    ];
    fixture.detectChanges();
  
    const tableRowElements = fixture.nativeElement.querySelectorAll('tbody tr');
  
    expect(tableRowElements.length).toBe(1);
  
    expect(tableRowElements[0].querySelector('td:nth-child(1)').textContent).toContain('May 1, 2024');
    expect(tableRowElements[0].querySelector('td:nth-child(2)').textContent).toContain('May 5, 2024');
  });
});
