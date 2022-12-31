import { TestBed } from '@angular/core/testing';

import { GastosMoraService } from './gastos-mora.service';

describe('GastosMoraService', () => {
  let service: GastosMoraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GastosMoraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
