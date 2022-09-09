import { TestBed } from '@angular/core/testing';

import { EjecutivoService } from './ejecutivo.service';

describe('EjecutivoService', () => {
  let service: EjecutivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EjecutivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
