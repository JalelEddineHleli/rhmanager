import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepartmentService, Department } from 'src/app/core/services/department.service';
import { AjouterDepartmentComponent } from "../ajouter-department/ajouter-department.component";
import { ModifierDepartmentComponent } from "../modifier-department/modifier-department.component";

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, AjouterDepartmentComponent, ModifierDepartmentComponent]
})
export class DepartmentListComponent implements OnInit {

  departments: Department[] = [];
  showAddModal = false;
  selectedDepartment: Department | null = null;

  constructor(private departmentService: DepartmentService) {
    
  }
onDepartmentAdded(newDepartment: Department): void {
  this.loadDepartments(); // Recharge la liste
}
handleAdd(newDept: Department): void {
  this.showAddModal = false;  // Fermer le modal
  this.loadDepartments();      // Recharger la liste pour afficher le nouveau
}
  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe((data) => {
      this.departments = data;
    });
  }

  openModal(): void {
    this.showAddModal = true;
  }



  deleteDepartment(id: number): void {
    this.departmentService.deleteDepartment(id).subscribe(() => {
      this.loadDepartments();
    });
  }

  editDepartment(dept: Department): void {
    this.selectedDepartment = { ...dept };
  }

  handleUpdate(updated: Department): void {
    
  }
}
