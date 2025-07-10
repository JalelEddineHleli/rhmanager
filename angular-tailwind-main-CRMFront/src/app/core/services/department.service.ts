// src/app/core/services/department.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Employee } from './employee.service';

export interface Department {
  id?: number;
  name: string;
  description: string;
  departmentHead?: {  // Rendons cette propriété optionnelle
    id?: number;
    firstName?: string;
    lastName?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private apiUrl = 'http://localhost:8091/departmentapi';

  constructor(private http: HttpClient) {}

 getDepartments(): Observable<Department[]> {
  return this.http.get<{ content: Department[] }>(this.apiUrl).pipe(
    map(response => response.content)
  );
}


  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`);
  }
createDepartment(dept: Department): Observable<Department> {
  return this.http.post<Department>(this.apiUrl, dept, {
    withCredentials: true  // 🔥 IMPORTANT
  });
}


  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
