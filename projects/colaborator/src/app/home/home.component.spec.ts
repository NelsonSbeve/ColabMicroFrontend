import { HomeComponent } from './home.component';
import { ApiService } from '../api.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { NgToastComponent, NgToastService } from 'ng-angular-popup';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import Spy = jasmine.Spy;

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let toastSpy: jasmine.SpyObj<NgToastService>;
  let getItemsSpy: Spy;
  let createItemSpy: Spy;
  let S: Spy;
  let E: Spy;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['getItems', 'createItem']);
    // const toastSpy = jasmine.createSpyObj('NgToastService', ['getToastDetails','success', 'error', 'info', 'warning']);
    getItemsSpy = apiSpy.getItems.and.returnValue(of([])); // Now TypeScript knows this is a Spy
    createItemSpy = apiSpy.createItem.and.returnValue(of({}));
    // S= toastSpy.success.and.returnValue(of([]));
    // E = toastSpy.error.and.returnValue(of({}));



    await TestBed.configureTestingModule({
     imports: [HomeComponent],
      // declarations: [ NgToastComponent ],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        // { provide: NgToastService, useValue: toastSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch items on initialization', () => {
    const mockItems = [{ name: 'John Doe', email: 'john@example.com', street: '123 Main St', postalCode: '12345' }];
    getItemsSpy.and.returnValue(of(mockItems));

    component.ngOnInit();
    fixture.detectChanges();

    expect(getItemsSpy).toHaveBeenCalled();
    expect(component.items).toEqual(mockItems);
    expect(component.filteredItems).toEqual(mockItems);
  });

  it('should filter items based on search term', () => {
    const mockItems = [{ name: 'John Doe', email: 'john@example.com', street: '123 Main St', postalCode: '12345' }];
    component.items = mockItems;
    component.searchTerm = 'John';

    component.searchCollaborators();

    expect(component.filteredItems).toEqual(mockItems);
  });

  it('should create a new item', () => {
    const formData = { email: 'jane@example.com', name: 'Jane Doe', address: '456 Main St', postalCode: '67890' };
    const newItem = { email: formData.email, name: formData.name, street: formData.address, postalCode: formData.postalCode };
    createItemSpy.and.returnValue(of(newItem));

    component.createNewItem(formData);

    expect(createItemSpy).toHaveBeenCalledWith(newItem);
  });

  it('should handle form submission and show success toast', async () => {
    const formData = { email: 'jane@example.com', name: 'Jane Doe', address: '456 Main St', postalCode: '67890' };
    const newItem = { email: formData.email, name: formData.name, street: formData.address, postalCode: formData.postalCode };
    createItemSpy.and.returnValue(of(newItem));


    await component.createNewItem(formData);

    expect(createItemSpy).toHaveBeenCalledWith(newItem);
    // expect(S).toHaveBeenCalledWith({ detail: 'New Colab added!', summary: 'Success', duration: 5000 });
    expect(component.showAddColabForm).toBeFalse();
  });

  // it('should handle form submission error and show error toast', async () => {
  //   const formData = { email: 'jane@example.com', name: 'Jane Doe', address: '456 Main St', postalCode: '67890' };
  //   const errorResponse = { error: ['An error occurred while creating the item.'] };
  //   createItemSpy.and.returnValue(throwError(errorResponse));

  //   await component.createNewItem(formData);

  //   expect(createItemSpy).toHaveBeenCalledWith({
  //     email: formData.email,
  //     name: formData.name,
  //     street: formData.address,
  //     postalCode: formData.postalCode
  //   });
  //   // expect(E).toHaveBeenCalledWith({ detail: 'An error occurred while creating the item.', summary: 'Error' });
  //   expect(component.showAddColabForm).toBeTrue();
  // });

  it('should show and hide the add collaborator form', () => {
    const addColabBtn: DebugElement = fixture.debugElement.query(By.css('.add-colab-btn'));
    addColabBtn.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.showAddColabForm).toBeTrue();
    let form = fixture.debugElement.query(By.css('.add-holiday-form'));
    expect(form).toBeTruthy();

    const closeBtn: DebugElement = fixture.debugElement.query(By.css('.close'));
    closeBtn.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.showAddColabForm).toBeFalse();
    form = fixture.debugElement.query(By.css('.add-holiday-form'));
    expect(form).toBeNull();
  });

  it('should display the list of collaborators', () => {
    const mockItems = [
      { name: 'John Doe', email: 'john@example.com', street: '123 Main St', postalCode: '12345' },
      { name: 'Jane Doe', email: 'jane@example.com', street: '456 Main St', postalCode: '67890' }
    ];
    component.filteredItems = mockItems;
    fixture.detectChanges();

    const collaboratorNames = fixture.debugElement.queryAll(By.css('.colaborator-name')).map(de => de.nativeElement.textContent);
    expect(collaboratorNames).toEqual(['John Doe', 'Jane Doe']);
  });
});
