import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobacionDetalleComponent } from './aprobacion-detalle.component';

describe('AprobacionDetalleComponent', () => {
  let component: AprobacionDetalleComponent;
  let fixture: ComponentFixture<AprobacionDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobacionDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobacionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
