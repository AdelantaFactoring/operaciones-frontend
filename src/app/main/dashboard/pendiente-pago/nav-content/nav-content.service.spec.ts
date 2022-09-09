import { TestBed } from '@angular/core/testing';

import { NavContentService } from './nav-content.service';

describe('NavContentService', () => {
  let service: NavContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
