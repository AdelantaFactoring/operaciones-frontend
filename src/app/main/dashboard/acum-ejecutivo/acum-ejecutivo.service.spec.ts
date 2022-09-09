import { TestBed } from '@angular/core/testing';

import { AcumEjecutivoService } from './acum-ejecutivo.service';

describe('AcumEjecutivoService', () => {
  let service: AcumEjecutivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcumEjecutivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
