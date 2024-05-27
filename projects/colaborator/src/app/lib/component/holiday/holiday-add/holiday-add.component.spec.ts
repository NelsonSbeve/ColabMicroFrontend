import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayAddComponent } from './holiday-add.component';
import { HttpClientModule } from '@angular/common/http';

describe('HolidayAddComponent', () => {
  let component: HolidayAddComponent;
  let fixture: ComponentFixture<HolidayAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolidayAddComponent, HttpClientModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HolidayAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render form', () => {
    const formElement = fixture.nativeElement.querySelector('.form');
    const headingElement = fixture.nativeElement.querySelector('h1');
    const labelElements = fixture.nativeElement.querySelectorAll('label');
    const inputElements = fixture.nativeElement.querySelectorAll('input[type="date"]');
    const buttonElement = fixture.nativeElement.querySelector('button[type="submit"]');

    expect(formElement).toBeTruthy();
    expect(headingElement.textContent).toContain('Adicionar Holiday');
    expect(labelElements[0].textContent).toContain('Colaborador:');
    expect(labelElements[1].textContent).toContain('Data de Início:');
    expect(labelElements[2].textContent).toContain('Data de Fim:');
    expect(inputElements.length).toBe(2);
    expect(buttonElement).toBeTruthy();
  });

  it('should call add method with input values when "Adicionar" button is clicked', () => {
    spyOn(component, 'add');

    component.colaborators = [{id: 1, name: 'John'}];
    component._colabId = "1";
    fixture.detectChanges();

    const colabSelect = fixture.nativeElement.querySelector('#new-holiColab');
    const holiStartInput = fixture.nativeElement.querySelector('#new-holiStart');
    const holiEndInput = fixture.nativeElement.querySelector('#new-holiEnd');
    const addButton = fixture.nativeElement.querySelector('button[type="submit"]');

    colabSelect.value = 'John';
    holiStartInput.value = '2024-05-01';
    holiEndInput.value = '2024-05-05';
    addButton.click();

    expect(component.add).toHaveBeenCalledWith("1", '2024-05-01', '2024-05-05');
  });
});
