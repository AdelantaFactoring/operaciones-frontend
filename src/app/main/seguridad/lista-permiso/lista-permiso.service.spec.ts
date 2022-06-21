import { TestBed } from '@angular/core/testing';

import { ListaPermisoService } from './lista-permiso.service';

describe('ListaPermisoService', () => {
  let service: ListaPermisoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListaPermisoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
