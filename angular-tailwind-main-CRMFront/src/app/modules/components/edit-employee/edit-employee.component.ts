import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService, Employee } from 'src/app/core/services/employee.service';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class EditEmployeeComponent {
  @Input() employee: Employee | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() employeeUpdated = new EventEmitter<void>();

  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      workEmail: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      position: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      hireDate: ['', Validators.required],
      contractType: ['', Validators.required],
      departmentId: [null],
      managerId: [null]
    });
  }

  ngOnChanges(): void {
    if (this.employee) {
      this.employeeForm.patchValue({
        ...this.employee,
        departmentId: this.employee.department?.id,
        managerId: this.employee.manager?.id
      });
    }
  }

  onSubmit(): void {
    if (this.employeeForm.invalid || !this.employee) return;

    const updatedEmployee: Employee = {
      ...this.employee,
      ...this.employeeForm.value
    };
 this.employeeService.updateEmployee(this.employee.id, this.employee).subscribe({
      next: updated => {
        alert('Employé mis à jour avec succès');
        console.log(updated);
      },
      error: err => {
        alert('Erreur lors de la mise à jour');
        console.error(err);
      }
    });
  }
  

  onClose(): void {
    this.close.emit();
  }
}