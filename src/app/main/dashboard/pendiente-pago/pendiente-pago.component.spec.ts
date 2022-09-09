import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendientePagoComponent } from './pendiente-pago.component';

describe('PendientePagoComponent', () => {
  let component: PendientePagoComponent;
  let fixture: ComponentFixture<PendientePagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendientePagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendientePagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
