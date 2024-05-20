import { Component, EventEmitter, Input, Output, SimpleChanges, output } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../service/project.service';

@Component({
  selector: 'app-projeto',
  standalone: true,
  imports: [CommonModule, FormsModule,  NgToastModule],
  templateUrl: './projeto.component.html',
  styleUrl: './projeto.component.css'
})
export class ProjetoComponent {

  constructor(private apiService: ApiService, private toast: NgToastService, private projetoService: ProjectService) {
  }
  @Output() ProjetoLista = new EventEmitter();
  @Input() id: any;
  itemsProject: any[] = [];
  filteredItemsProject: any[] = [];
  associations: any[] = [];
  searchTermProject: string = '';


  ngOnChanges(changes: SimpleChanges) {
    if (changes['id'] && changes['id'].currentValue) {
      this.fetchAssociations(this.id);
    }
  }

  fetchAssociations(_id: any): void {
  this.filteredItemsProject = [];
  this.apiService.getAssociatedProjects(_id).subscribe((response) => {
      this.associations = response as any[];
      const projectIds: number[] = this.associations.map(association => association.projectId);
      projectIds.forEach((projectId: number) => {
        this.loadItemsProject(projectId);
      });

    });

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
      return this.projetoService.getItemsProjeto(id).pipe(
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

}
