import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule,  NgToastModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


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

  constructor(private apiService: ApiService, private toast: NgToastService) {
  }
  ngOnInit() {
    this.fetchItems();

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
    this.filteredItemsProject = [];
    this.fetchAssociations(_id);
    console.log('Response:', this.filteredItemsProject);
    this.showProjectDiv = true;

  }


  fetchAssociations(_id: any): void {
  this.apiService.getAssociatedProjects(_id).subscribe((response) => {
      this.associations = response as any[];
      const projectIds: number[] = this.associations.map(association => association.projectId);
      projectIds.forEach((projectId: number) => {
        this.loadItemsProject(projectId);
      });
      this.showProjectDiv = true;
    });

  }



  viewHolidays(_t68: any) {
    throw new Error('Method not implemented.');
    }

    loadItemsProject(id: number): void {
      this.fetchItemsProject(id).subscribe(
        (items: any[]) => {
          console.log('Items:', items); // Check the value of 'items'
          // Ensure items is not undefined before mapping
          if (Array.isArray(items)) {
            // Append the items to filteredItemsProject instead of overwriting
            this.filteredItemsProject = [...this.filteredItemsProject, ...items.map(item => ({
              ...item,
              startDate: new Date(item.startDate),
              endDate: new Date(item.endDate)
            }))];
          } else {
            console.error('Expected an array of items');
          }
        },
        (error) => {
          console.error('Error fetching items:', error);
        }
      );
    }

    fetchItemsProject(id: number): Observable<any[]> {
      return this.apiService.getItemsProjeto(id).pipe(
        map((response: any) => {
          console.log('Response:', response);
          // Check if the response is an array
          if (Array.isArray(response)) {
            // If it's already an array, return it
            return response.map(item => ({
              ...item,
              startDate: new Date(item.startDate),
              endDate: new Date(item.endDate)
            }));
          } else if (response && typeof response === 'object') {
            // If it's an object, transform it into an array with a single item
            const itemArray = [{
              ...response,
              startDate: new Date(response.startDate),
              endDate: new Date(response.endDate)
            }];
            return itemArray;
          } else {
            // Otherwise, return an empty array or handle the error case as needed
            console.error('Unexpected response format:', response);
            return [];
          }
        })
      );
    }



    searchProjects() {
      this.filteredItemsProject = this.itemsProject.filter(item =>
        item.name.toLowerCase().includes(this.searchTermProject.toLowerCase())
      );
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

