import { TestBed } from '@angular/core/testing';

import { GeminiReportService } from './gemini-report.service';

describe('GeminiReportService', () => {
  let service: GeminiReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeminiReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
