import { TestBed } from '@angular/core/testing';

import { AprobacionService } from './desembolso.service';

describe('DesembolsoService', () => {
  let service: AprobacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AprobacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
