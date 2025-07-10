import { Component, OnInit } from '@angular/core';
import { EmployeeService, Employee } from 'src/app/core/services/employee.service';
import { AddEmployeeComponent } from "../add-employee/add-employee.component";
import { EditEmployeeComponent } from "../edit-employee/edit-employee.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  imports: [AddEmployeeComponent, EditEmployeeComponent, CommonModule]
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  totalElements = 0;
  page = 0;
  size = 5;
  isLoading = false;

  // Modals state
  showAddModal = false;
  showEditModal = false;
  showDeleteDialog = false;
  selectedEmployeeId: number | null = null;
  currentEmployee: Employee | null = null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getAllEmployees(this.page, this.size).subscribe({
      next: (data) => {
        this.employees = data.content;
        this.totalElements = data.totalElements;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadEmployees();
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  openEditModal(employee: Employee): void {
    this.currentEmployee = employee;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }
  deleteEmployee(id: number) {
    if(confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          alert('Employé supprimé avec succès.');
          this.loadEmployees();  // recharge la liste après suppression
        },
        error: () => alert('Erreur lors de la suppression.')
      });
    }
  }

  closeDeleteDialog(): void {
    this.showDeleteDialog = false;
    this.selectedEmployeeId = null;
  }

  onEmployeeAdded(): void {
    this.closeAddModal();
    this.loadEmployees();
  }

  onEmployeeUpdated(): void {
    this.closeEditModal();
    this.loadEmployees();
  }

  confirmDelete(): void {
   
  }
}