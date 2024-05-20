import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColabsMoreThanXDaysComponent } from './colabs-more-than-xdays.component';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('ColabsMoreThanXDaysComponent', () => {
  let component: ColabsMoreThanXDaysComponent;
  let fixture: ComponentFixture<ColabsMoreThanXDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColabsMoreThanXDaysComponent, HttpClientModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: {get:(id:number)=>{id:1}}}}
        }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColabsMoreThanXDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display message when there are no colaborators', () => {
    const message = fixture.nativeElement.querySelector('h3');

    expect(message.textContent).toContain('Não há colaboradores.')
  });

  it('should display table when there are colaborators', () => {
    component.colaboratorsXDays = [
      {id: 1, name: 'John Doe'}
    ];

    fixture.detectChanges();

    const tableElement = fixture.nativeElement.querySelector('table');
    const tableRowElements = fixture.nativeElement.querySelectorAll('tbody td');

    expect(tableElement).toBeTruthy();
    expect(tableRowElements.length).toBe(2);
    expect(tableRowElements[0].textContent).toContain('1');
    expect(tableRowElements[1].textContent).toContain('John Doe');
  });
});
