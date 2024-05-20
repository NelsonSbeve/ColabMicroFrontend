import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { ProjetoComponent } from "../projeto/projeto.component";
import { HolidayComponent } from "../holiday/holiday.component";
import { ColaboratorService } from '../../service/colaborator.service';
import { HolidayService } from '../../service/holiday.service';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [CommonModule, FormsModule, NgToastModule, ProjetoComponent, HolidayComponent]
})
export class HomeComponent {
  _colabId:number | undefined
  _colabName: string | undefined
  colaboratorsMap: Map<number, string> = new Map()
  id: number | undefined;
  items: any[] = [];
  associations: any[] = [];
  filteredItems: any[] = [];
  itemsProject: any[] = [];
  filteredItemsProject: any[] = [];
  filteredItemsProject2: any[] = [];
  searchTerm: string = '';
  searchTermProject: string = '';
  showAddColabForm = false;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  showProjectDiv = false;
  showAddHolidayForm: boolean = false;
  showHolidayDiv = false;

  constructor(
    private apiService: ApiService, 
    private toast: NgToastService, 
    private holidayService: HolidayService,
    private colaboratorService: ColaboratorService
  ) {}
  ngOnInit() {
    this.fetchItems();
    this.colaboratorService.getColaborators().subscribe(colaborators => {
      colaborators.forEach(colab => {
        this.colaboratorsMap.set(colab.id, colab.name);
      });
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredItems.length / this.itemsPerPage);
  }
  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage - 1, this.filteredItems.length - 1);
  }

  get pagedItems(): any[] {
    return this.filteredItems.slice(this.startIndex, this.endIndex + 1);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  viewProjects(_id: any) {
    this.id = _id;
    this.showProjectDiv = true;
    this.showHolidayDiv = false;
  }

  viewHolidays(_colabId: number, _colabName: string) {
    this._colabId = _colabId;
    this._colabName = _colabName;
    this.showHolidayDiv = true;
    this.showProjectDiv = false;
    }

    filterByHolidays(nDays: string) {
      const days = parseInt(nDays, 10);
      if (!nDays || isNaN(days) || days <= 0) {
        this.filteredItems = this.items;
      } else {
        this.holidayService.getColaboratorsXDays(days).subscribe(ids => {
          this.filteredItems = this.items.filter(item => ids.includes(item.id));
        });
      }
    }

  fetchItems() {
    if (this.apiService) {
      this.apiService.getItems().subscribe((response) => {
        console.log('Items:', response);
        this.items = response as any[];
        this.filteredItems = this.items;
      });
    }
  }
  searchCollaborators() {
    this.filteredItems = this.items.filter(item =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  hideAddColabPopup() {
    this.showAddColabForm = false;
  }

  createNewItem(formData: any) {
    const newItem = {
      email: formData.email,
      name: formData.name,
      street: formData.address,
      postalCode: formData.postalCode
    };
    this.apiService.createItem(newItem).subscribe({
      next: async (response) => {
        await wait(500);
        this.fetchItems();
        console.log('Created item:', response);
        this.toast.success({ detail: 'New Colab added!', summary: 'Success', duration: 5000 });
        this.hideAddColabPopup();

        // Handle success or any UI updates here
      },
      error: (errorResponse) => {
        console.error('Error creating item:', errorResponse);
        if (errorResponse.error && Array.isArray(errorResponse.error) && errorResponse.error.length > 0) {
          const errorMessage = errorResponse.error[0]; // Extract the error message
          this.toast.error({ detail: errorMessage, summary: 'Error' });
        } else {
          this.toast.error({ detail: 'An error occurred while creating the item.', summary: 'Error' });
        }
        // Handle error or any UI updates here
      }
    });
  }
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

