import { TestBed } from '@angular/core/testing';

import { ConsultaFactrackService } from './consulta-factrack.service';

describe('ConsultaFactrackService', () => {
  let service: ConsultaFactrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultaFactrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
