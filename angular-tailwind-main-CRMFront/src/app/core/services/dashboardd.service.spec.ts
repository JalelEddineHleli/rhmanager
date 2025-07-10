import { TestBed } from '@angular/core/testing';

import { DashboarddService } from './dashboardd.service';

describe('DashboarddService', () => {
  let service: DashboarddService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboarddService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
