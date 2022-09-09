import { TestBed } from '@angular/core/testing';

import { PendientePagoService } from './pendiente-pago.service';

describe('PendientePagoService', () => {
  let service: PendientePagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendientePagoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
