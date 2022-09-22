import { TestBed } from '@angular/core/testing';

import { AcumPagadorService } from './acum-pagador.service';

describe('AcumPagadorService', () => {
  let service: AcumPagadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcumPagadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
