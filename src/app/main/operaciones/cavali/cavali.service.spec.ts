import { TestBed } from '@angular/core/testing';

import { CavaliService } from './cavali.service';

describe('CavaliService', () => {
  let service: CavaliService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CavaliService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
