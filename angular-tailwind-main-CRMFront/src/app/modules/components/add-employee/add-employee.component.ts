import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department, DepartmentService } from 'src/app/core/services/department.service';
import { EmployeeService, Employee,  } from 'src/app/core/services/employee.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
  imports: [ CommonModule, ReactiveFormsModule]
})
export class AddEmployeeComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() employeeAdded = new EventEmitter<void>();
departments: Department[] = [];

  employeeForm: FormGroup;
  managers: Employee[] = [];
  //contractTypes = Object.values(ContractType);

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
      private departmentService: DepartmentService

  ) {
    this.employeeForm = this.fb.group({
      // Informations personnelles
      firstName: [''],
      lastName: [''],
      birthDate: [''],
      personalEmail: [''],
      phoneNumber: [''],

      // Adresse
      address: [''],
      city: [''],
      postalCode: [''],
      country: [''],

      // Informations professionnelles
      position: [''],
    department: ['', Validators.required], // <- ici on attend l’ID du département
      salary: [0],
      hireDate: ['', ],
      contractType: [''],
      active: [true],
      workEmail: [''],

      // Relations
      manager: [null]
    });
  }

  ngOnInit(): void {
    this.loadManagers();
     this.loadDepartments();
  }

  loadManagers(): void {
    this.employeeService.getManagers().subscribe(managers => {
      this.managers = managers;
    });
  }
  loadDepartments(): void {
  this.departmentService.getDepartments().subscribe(depts => {
    this.departments = depts;
  });
  }
  onSubmit(): void {
    if (this.employeeForm.invalid) return;

    const formValue = this.employeeForm.value;
    const employeeData: Employee = {
      ...formValue,
        department: formValue.department ? { id: formValue.department } : null,
      manager: formValue.manager ? { id: formValue.manager } : null
    };

    this.employeeService.createEmployee(employeeData).subscribe({
      next: () => {
        this.employeeAdded.emit();
      },
      error: (err) => {
        console.error('Error creating employee:', err);
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }
}