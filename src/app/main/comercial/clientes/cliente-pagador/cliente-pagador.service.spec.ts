import { TestBed } from '@angular/core/testing';

import { ClientePagadorService } from './cliente-pagador.service';

describe('ClientePagadorService', () => {
  let service: ClientePagadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientePagadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
