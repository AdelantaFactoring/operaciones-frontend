import { TestBed } from '@angular/core/testing';

import { SolicitudesFormService } from './solicitudes-form.service';

describe('SolicitudesFormService', () => {
  let service: SolicitudesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudesFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
