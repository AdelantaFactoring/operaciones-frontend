import { TestBed } from '@angular/core/testing';

import { SolicitudGrillaService } from './solicitud-grilla.service';

describe('SolicitudGrillaService', () => {
  let service: SolicitudGrillaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudGrillaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
