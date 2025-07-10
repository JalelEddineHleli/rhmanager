// src/app/core/services/employee.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from './department.service';

export interface Employee {
  id: number;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  personalEmail?: string;
  phoneNumber?: string;

  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;

  position?: string;
  department?: Department;
  salary?: number;
  hireDate?: string;
  contractType?: 'CDI' | 'CDD' | 'STAGE' | 'AUTRE'; // adapter à tes types
  active?: boolean;
  workEmail?: string;

  manager?: Employee;
}


@Injectable({ providedIn: 'root' })
export class EmployeeService {
 private apiUrl = 'http://localhost:8091/api/employees';


  constructor(private http: HttpClient) {}
 createEmployee(employee: Employee): Observable<Employee> {
  return this.http.post<Employee>(`${this.apiUrl}`, employee);
}


  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }
  
  
  getAllEmployees(page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getEmployeesByManager(managerId: number, page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/manager/${managerId}?page=${page}&size=${size}`);
  }

  getEmployeesByDepartment(dept: string, page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/department/${dept}?page=${page}&size=${size}`);
  }

  getActiveEmployees(page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/active?page=${page}&size=${size}`);
  }
  getManagers(): Observable<Employee[]> {
  return this.http.get<Employee[]>(`${this.apiUrl}/managers`);
}
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
