import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Department } from 'src/app/core/services/department.service';

@Component({
  selector: 'app-modifier-department',
  templateUrl: './modifier-department.component.html',
  styleUrls: ['./modifier-department.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class ModifierDepartmentComponent {
  @Input() department!: Department;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Department>();

  onSave(): void {
    if (this.department.name.trim()) {
      this.save.emit(this.department);
    }
  }

  onCancel(): void {
    this.close.emit();
  }
}
