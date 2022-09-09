import { TestBed } from '@angular/core/testing';

import { ProyectadoService } from './proyectado.service';

describe('ProyectadoService', () => {
  let service: ProyectadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProyectadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
