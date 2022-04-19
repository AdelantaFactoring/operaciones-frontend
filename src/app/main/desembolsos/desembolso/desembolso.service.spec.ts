import { TestBed } from '@angular/core/testing';

import { DesembolsoService } from './desembolso.service';

describe('DesembolsoService', () => {
  let service: DesembolsoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesembolsoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
