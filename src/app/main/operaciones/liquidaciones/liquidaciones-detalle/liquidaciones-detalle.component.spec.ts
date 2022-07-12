import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidacionesDetalleComponent } from './liquidaciones-detalle.component';

describe('LiquidacionesDetalleComponent', () => {
  let component: LiquidacionesDetalleComponent;
  let fixture: ComponentFixture<LiquidacionesDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidacionesDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionesDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
