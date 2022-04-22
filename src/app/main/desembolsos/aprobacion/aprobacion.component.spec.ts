import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobacionComponent } from './desembolso.component';

describe('DesembolsoComponent', () => {
  let component: AprobacionComponent;
  let fixture: ComponentFixture<AprobacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
