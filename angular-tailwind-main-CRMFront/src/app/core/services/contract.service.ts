// src/app/core/services/contract.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Contract {
  id?: number;
  contractReference: string;
  startDate: string;
  endDate: string;
  salary: number;
  contractType: 'CDI' | 'CDD' | 'STAGE';
  employee: any;
}

@Injectable({ providedIn: 'root' })
export class ContractService {
  private apiUrl = 'http://localhost:8091/contractapi';

  constructor(private http: HttpClient) {}

  getContracts(page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getContractById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.apiUrl}/${id}`);
  }

  createContract(contract: Contract): Observable<Contract> {
    return this.http.post<Contract>(this.apiUrl, contract);
  }

  deleteContract(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
