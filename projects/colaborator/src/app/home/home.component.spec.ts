

import { HomeComponent } from './home.component';
import Spy = jasmine.Spy;
import { ApiService } from '../api.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let getItemsSpy: Spy;
  let createItemSpy: Spy;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['getItems', 'createItem']);
    getItemsSpy = apiSpy.getItems.and.returnValue(of([])); // Now TypeScript knows this is a Spy
    createItemSpy = apiSpy.createItem.and.returnValue(of({})); // Now TypeScript knows this is a Spy

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [{ provide: ApiService, useValue: apiSpy }]
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
    const mockItems = [{ name: 'John Doe', email: 'john@example.com', address: '123 Main St', postalCode: '12345' }];
    getItemsSpy.and.returnValue(of(mockItems)); // Use the Spy here

    component.ngOnInit();

    expect(getItemsSpy).toHaveBeenCalled();
    expect(component.items).toEqual(mockItems);
    expect(component.filteredItems).toEqual(mockItems);
  });

  it('should filter items based on search term', () => {
    const mockItems = [{ name: 'John Doe', email: 'john@example.com', address: '123 Main St', postalCode: '12345' }];
    component.items = mockItems;
    component.searchTerm = 'John';

    component.searchCollaborators();

    expect(component.filteredItems).toEqual(mockItems);
  });

  it('should create a new item', () => {
    const formData = { email: 'jane@example.com', name: 'Jane Doe', address: '456 Main St', postalCode: '67890' };
    const newItem = { email: formData.email, name: formData.name, street: formData.address, postalCode: formData.postalCode };
    createItemSpy.and.returnValue(of(newItem)); // Use the Spy here

    component.createNewItem(formData);

    expect(createItemSpy).toHaveBeenCalledWith(newItem);
  });
});
