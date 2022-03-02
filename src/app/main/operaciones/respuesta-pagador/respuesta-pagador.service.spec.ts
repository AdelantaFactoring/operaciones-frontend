import { TestBed } from '@angular/core/testing';

import { RespuestaPagadorService } from './respuesta-pagador.service';

describe('RespuestaPagadorService', () => {
  let service: RespuestaPagadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RespuestaPagadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
