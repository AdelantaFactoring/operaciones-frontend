import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaFactrackDetalleComponent } from './consulta-factrack-detalle.component';

describe('ConsultaFactrackDetalleComponent', () => {
  let component: ConsultaFactrackDetalleComponent;
  let fixture: ComponentFixture<ConsultaFactrackDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaFactrackDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaFactrackDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
