import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DepartmentService } from 'src/app/core/services/department.service';
import { Employee, EmployeeService } from 'src/app/core/services/employee.service';
import { DepartmentListComponent } from '../department-list/department-list.component';

export interface Department {
  name: string;
  description: string;
  departmentHead: {
    firstName: string;
    lastName: string;
    id:number;
  };
  departmentHeadId?: number;
}

@Component({
  selector: 'app-ajouter-department',
  templateUrl: './ajouter-department.component.html',
  styleUrls: ['./ajouter-department.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AjouterDepartmentComponent implements OnInit {
  department: Department = {
    name: '',
    description: '',
    departmentHead: {
      firstName: '',
      lastName: '',
      id: 0
    },
    departmentHeadId: undefined
  };

  managers: Employee[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Department>();

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {
     DepartmentListComponent
  }

  ngOnInit(): void {
    this.loadManagers();
  }
    departments: Department[] = [];
  
 
  loadManagers(): void {
    this.employeeService.getManagers().subscribe(managers => {
      this.managers = managers;
    });
  }
  onSave(): void {
   this.department.departmentHead = { id: this.department.departmentHead as any } as any;


      // 🔥 Envoie au backend ici
      this.departmentService.createDepartment(this.department).subscribe({
    next: (createdDepartment) => {
      this.save.emit(this.department);  // 🔥 IMPORTANT: Passe le département créé
      this.onCancel();
        
          alert('Département ajouté avec succès');
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout', err);
          alert('Erreur lors de l\'ajout');
        }
      });
    }
  

  onCancel(): void {
    this.close.emit();
  }
}

