import { TestBed } from '@angular/core/testing';

import { PagadorService } from './pagador.service';

describe('PagadorService', () => {
  let service: PagadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
