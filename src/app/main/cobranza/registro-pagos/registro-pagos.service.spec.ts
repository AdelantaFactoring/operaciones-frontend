import { TestBed } from '@angular/core/testing';

import { RegistroPagosService } from './registro-pagos.service';

describe('RegistroPagosService', () => {
  let service: RegistroPagosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroPagosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
