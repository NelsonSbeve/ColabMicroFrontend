import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  items: any[] = [];
  filteredItems: any[] = [];
  searchTerm: string = '';

  constructor(private apiService: ApiService, private toast: NgToastService) {}
  ngOnInit() {
    this.fetchItems();
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

  createNewItem(formData: any) {
    const newItem = {
      email: formData.email,
      name: formData.name,
      street: formData.address,
      postalCode: formData.postalCode
    };
    this.apiService.createItem(newItem).subscribe((response) => {
      console.log('Created item:', response);
      this.toast.success({detail: 'New Colab added!', summary: 'Success', duration: 5000});
      // Handle success or any UI updates here
    });
  }
}
