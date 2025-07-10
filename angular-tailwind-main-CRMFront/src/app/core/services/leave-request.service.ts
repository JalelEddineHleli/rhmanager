// src/app/core/services/leave-request.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LeaveRequest {
  id?: number;
  employee: any;
  startDate: string;
  endDate: string;
  leaveType: 'ANNUEL' | 'MALADIE' | 'MATERNITE';
  status: 'EN_ATTENTE' | 'APPROUVE' | 'REJETE';
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class LeaveRequestService {
  private apiUrl = 'http://localhost:8091/leaveapi';

  constructor(private http: HttpClient) {}

  getLeaves(page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getLeaveById(id: number): Observable<LeaveRequest> {
    return this.http.get<LeaveRequest>(`${this.apiUrl}/${id}`);
  }

  createLeave(leave: LeaveRequest): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(this.apiUrl, leave);
  }

  deleteLeave(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
